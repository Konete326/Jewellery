import { orderRepository } from './order.repository.js';
import { createOrderRateSnapshot } from './order.lock.js';
import { sendCustomerOrderStatusEmail } from './order.mailer.js';
import { validateOrderStatusTransition } from './order.transitions.js';
import { Payment } from './payment.model.js';

function normalizeOrderItem(item) {
  let size = typeof item?.size === 'string' ? item.size.trim() : '';
  if (!size && typeof item?.title === 'string') {
    const match = item.title.match(/\[Size:\s*([^\]]+)\]/i);
    if (match && match[1]) size = match[1].trim();
  }
  return { ...item, size };
}

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

  async getOrderById(id) {
    return this.repo.findById(id);
  }

  async getOrderByNumber(orderNumber) {
    return this.repo.findByOrderNumber(orderNumber);
  }

  async createOrder(data) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = data.orderNumber || `KS-${Date.now().toString().slice(-6)}-${randomSuffix}`;
    const totalAmount = Number(data.totalAmount) || 0;
    const advancePaid = Number(data.advancePaid) || 0;
    const balanceDue = Math.max(0, totalAmount - advancePaid);
    const rawItems = Array.isArray(data.items) ? data.items : [];
    const items = rawItems.map(normalizeOrderItem);
    const rateSnapshot = await createOrderRateSnapshot(data);
    const goldRateLock = data.goldRateLock?.isLocked ? data.goldRateLock : rateSnapshot;

    return this.repo.create({
      ...data,
      fulfillmentType: data.fulfillmentType || 'Showroom Pickup',
      items: items.length > 0 ? items : data.items,
      orderNumber,
      totalAmount,
      advancePaid,
      balanceDue: data.balanceDue !== undefined ? Number(data.balanceDue) : balanceDue,
      goldRateLock
    });
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
      data.goldRateLock = {
        ...existing.goldRateLock,
        ...data.goldRateLock,
        snapshotRate: existing.goldRateLock.snapshotRate || data.goldRateLock.snapshotRate,
        snapshotRatePerGram: existing.goldRateLock.snapshotRatePerGram || data.goldRateLock.snapshotRatePerGram,
        snapshotAt: existing.goldRateLock.snapshotAt || data.goldRateLock.snapshotAt,
        snapshotKarat: existing.goldRateLock.snapshotKarat || data.goldRateLock.snapshotKarat
      };
    }

    if (data.totalAmount !== undefined || data.advancePaid !== undefined) {
      const total = data.totalAmount !== undefined ? Number(data.totalAmount) : existing.totalAmount;
      const adv = data.advancePaid !== undefined ? Number(data.advancePaid) : existing.advancePaid;
      data.balanceDue = Math.max(0, total - adv);
    }
    if (Array.isArray(data.items)) {
      data.items = data.items.map(normalizeOrderItem);
    }

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
