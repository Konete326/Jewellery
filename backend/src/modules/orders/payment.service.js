import { Payment, normalizePaymentReference } from './payment.model.js';
import { Order } from './order.model.js';
import { PaymentAccount } from '../payment-accounts/paymentAccount.model.js';
import { formatPaymentReceipt } from './payment.receipt.js';
import { approvePaymentTransaction, rejectPaymentTransaction } from './payment.approval.service.js';
import { getBankLedger } from './payment.ledger.service.js';
import { sanitizeCustomerPayment, sanitizeCustomerReceipt } from './order.sanitize.js';

async function checkDuplicateReference(orderId, normalizedRef) {
  if (!normalizedRef) return;
  const existing = await Payment.findOne({ orderId, paymentReference: normalizedRef });
  if (existing) {
    const err = new Error(`Payment reference "${normalizedRef}" has already been submitted for this order (${existing.status})`);
    err.statusCode = 400;
    throw err;
  }
}

export class PaymentService {
  async recordPayment(orderId, data) {
    const order = await Order.findById(orderId);
    if (!order) {
      const err = new Error('Order not found');
      err.statusCode = 404;
      throw err;
    }

    const account = await PaymentAccount.findById(data.bankAccount);
    if (!account) {
      const err = new Error('Bank account not found');
      err.statusCode = 404;
      throw err;
    }
    if (!account.isActive) {
      const err = new Error('Selected bank account is inactive. Payments can only be submitted to active bank accounts.');
      err.statusCode = 400;
      throw err;
    }

    const amount = Number(data.amount) || 0;
    if (amount <= 0) {
      const err = new Error('Payment amount must be greater than zero');
      err.statusCode = 400;
      throw err;
    }

    const paymentReference = normalizePaymentReference(data.paymentReference);
    await checkDuplicateReference(order._id, paymentReference);

    let payment;
    try {
      payment = await Payment.create({
        orderId: order._id,
        orderNumber: order.orderNumber,
        customer: {
          name: order.customer?.name || data.customer?.name || 'Valued Patron',
          phone: order.customer?.phone || data.customer?.phone || '',
          email: order.customer?.email || data.customer?.email || ''
        },
        amount,
        paymentType: data.paymentType || 'Advance',
        bankAccount: account._id,
        bankAccountSnapshot: {
          bankName: account.bankName,
          accountTitle: account.accountTitle || '',
          accountNumber: account.accountNumber || '',
          iban: account.iban || '',
          accountType: account.accountType || 'Bank Account'
        },
        paymentReference,
        notes: String(data.notes || '').trim(),
        status: 'Pending'
      });
    } catch (dbErr) {
      if (dbErr.code === 11000) {
        const err = new Error(`Payment reference "${paymentReference}" has already been submitted for this order`);
        err.statusCode = 400;
        throw err;
      }
      throw dbErr;
    }

    if (!order.paymentDetails?.bankName) {
      order.paymentDetails = {
        method: 'Bank Transfer',
        transactionRef: payment.paymentReference,
        bankName: account.bankName
      };
      await order.save();
    }

    return payment;
  }

  async approvePayment(orderId, paymentId, adminUser) {
    return approvePaymentTransaction(orderId, paymentId, adminUser);
  }

  async rejectPayment(orderId, paymentId, reason, adminUser) {
    return rejectPaymentTransaction(orderId, paymentId, reason, adminUser);
  }

  async getOrderPayments(orderId, user) {
    const order = await Order.findById(orderId).lean();
    if (!order) {
      const err = new Error('Order not found');
      err.statusCode = 404;
      throw err;
    }
    const isAdmin = user?.role === 'admin';
    if (user && !isAdmin && user.email?.toLowerCase() !== order.customer?.email?.toLowerCase()) {
      const err = new Error('Forbidden: You can only view payments for your own orders');
      err.statusCode = 403;
      throw err;
    }
    const payments = await Payment.find({ orderId }).sort({ createdAt: -1 }).lean();
    return isAdmin ? payments : payments.map(sanitizeCustomerPayment);
  }

  async getOrderReceipts(orderId, user) {
    const order = await Order.findById(orderId).lean();
    if (!order) return [];
    const isAdmin = user?.role === 'admin';
    if (user && !isAdmin && user.email?.toLowerCase() !== order.customer?.email?.toLowerCase()) {
      const err = new Error('Forbidden: You can only view receipts for your own orders');
      err.statusCode = 403;
      throw err;
    }
    const approved = await Payment.find({ orderId, status: 'Approved' }).sort({ createdAt: -1 }).lean();
    return approved.map((p) => {
      const r = formatPaymentReceipt(order, p);
      return isAdmin ? r : sanitizeCustomerReceipt(r);
    });
  }

  async getAccountLedger(bankAccountId) {
    return getBankLedger(bankAccountId);
  }
}

export const paymentService = new PaymentService();
