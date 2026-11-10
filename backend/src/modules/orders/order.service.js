import { orderRepository } from './order.repository.js';
import { createOrderRateSnapshot } from './order.lock.js';
import { sendCustomerOrderStatusEmail, sendCustomerOrderPlacedEmail, sendAdminNewOrderEmail } from './order.mailer.js';
import { validateOrderStatusTransition } from './order.transitions.js';
import { Payment } from './payment.model.js';
import { normalizeOrderItem } from './order.sanitize.js';
import { paymentService } from './payment.service.js';

export class OrderService {
  constructor(repo = orderRepository) {
    this.repo = repo;
  }

  async listOrders(query = {}) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Number(query.limit) || 50);
    const skip = (page - 1) * limit;
    const filter = {};
    if (query.orderStatus && query.orderStatus !== 'All') filter.orderStatus = query.orderStatus;
    if (query.paymentStatus && query.paymentStatus !== 'All') filter.paymentStatus = query.paymentStatus;
    if (query.search) {
      const regex = new RegExp(query.search.trim(), 'i');
      filter.$or = [{ orderNumber: regex }, { 'customer.name': regex }, { 'customer.email': regex }, { 'customer.phone': regex }];
    }
    const { items, total } = await this.repo.findAll(filter, { skip, limit });
    return { items, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) || 1 } };
  }

  async getOrderById(id) { return this.repo.findById(id); }
  async getOrderByNumber(orderNumber) { return this.repo.findByOrderNumber(orderNumber); }

  async createOrder(data) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = data.orderNumber || `KS-${Date.now().toString().slice(-6)}-${randomSuffix}`;
    const totalAmount = Number(data.totalAmount) || 0;
    const initialDeposit = Number(data.initialPayment?.amount) || Number(data.advancePaid) || 0;
    const balanceDue = Math.max(0, totalAmount - initialDeposit);
    const rawItems = Array.isArray(data.items) ? data.items : [];
    const items = rawItems.map(normalizeOrderItem);
    const rateSnapshot = await createOrderRateSnapshot(data);
    const goldRateLock = data.goldRateLock?.isLocked ? data.goldRateLock : rateSnapshot;

    const createdOrder = await this.repo.create({
      ...data,
      fulfillmentType: 'Showroom Pickup',
      items: items.length > 0 ? items : data.items,
      orderNumber,
      totalAmount,
      advancePaid: initialDeposit,
      balanceDue: data.balanceDue !== undefined ? Number(data.balanceDue) : balanceDue,
      goldRateLock
    });

    let paymentDoc = null;
    if (data.initialPayment?.bankAccountId && Number(data.initialPayment?.amount) > 0) {
      try {
        paymentDoc = await paymentService.recordPayment(createdOrder._id, {
          bankAccount: data.initialPayment.bankAccountId,
          amount: Number(data.initialPayment.amount),
          paymentReference: data.initialPayment.paymentReference || '',
          paymentType: data.initialPayment.paymentType || 'Bank Transfer',
          notes: data.initialPayment.notes || 'Submitted at Showroom Checkout',
          customer: data.customer
        });
      } catch {}
    }
    sendCustomerOrderPlacedEmail({ order: createdOrder, payment: paymentDoc }).catch(() => null);
    sendAdminNewOrderEmail({ order: createdOrder, payment: paymentDoc }).catch(() => null);
    return createdOrder;
  }

  async updateOrder(id, data, adminUser) {
    const existing = await this.repo.findById(id);
    if (!existing) return null;

    if (data.orderStatus && data.orderStatus !== existing.orderStatus) {
      validateOrderStatusTransition(existing.orderStatus, data.orderStatus);
      if (data.orderStatus === 'Delivered') {
        data.collectionRecord = {
          collectedAt: data.collectionRecord?.collectedAt ? new Date(data.collectionRecord.collectedAt) : new Date(),
          collectedBy: data.collectionRecord?.collectedBy || existing.customer?.name || 'Valued Patron',
          verifiedBy: data.collectionRecord?.verifiedBy || adminUser?.name || adminUser?.email || 'Showroom Staff',
          notes: data.collectionRecord?.notes || ''
        };
      }
    }

    if (data.goldRateLock && existing.goldRateLock) {
      data.goldRateLock = { ...existing.goldRateLock, ...data.goldRateLock };
    }
    if (data.totalAmount !== undefined || data.advancePaid !== undefined) {
      const total = data.totalAmount !== undefined ? Number(data.totalAmount) : existing.totalAmount;
      const adv = data.advancePaid !== undefined ? Number(data.advancePaid) : existing.advancePaid;
      data.balanceDue = Math.max(0, total - adv);
    }
    if (Array.isArray(data.items)) data.items = data.items.map(normalizeOrderItem);

    const updated = await this.repo.update(id, data);
    if (updated && data.orderStatus && data.orderStatus !== existing.orderStatus) {
      await sendCustomerOrderStatusEmail({ order: updated, newStatus: data.orderStatus }).catch(() => null);
    }
    return updated;
  }

  async deleteOrder(id) {
    const approvedCount = await Payment.countDocuments({ orderId: id, status: 'Approved' });
    if (approvedCount > 0) {
      const err = new Error('Cannot delete order with approved payments. Transactions must be refunded first.');
      err.statusCode = 400;
      throw err;
    }
    await Payment.deleteMany({ orderId: id });
    return this.repo.delete(id);
  }
}

export const orderService = new OrderService();