import { Payment } from './payment.model.js';
import { Order } from './order.model.js';
import { evaluateRateLock } from './order.lock.js';
import { generateReceiptNumber, formatPaymentReceipt } from './payment.receipt.js';
import {
  sendCustomerPaymentApprovedEmail,
  sendCustomerPaymentRejectedEmail,
  sendCustomerOrderStatusEmail
} from './order.mailer.js';

const notFound = (msg) => Object.assign(new Error(msg), { statusCode: 404 });
const badRequest = (msg) => Object.assign(new Error(msg), { statusCode: 400 });

const orderLocks = new Map();

async function withOrderLock(orderId, task) {
  const key = String(orderId);
  const prev = orderLocks.get(key) || Promise.resolve();
  let release;
  const current = new Promise((resolve) => { release = resolve; });
  const chained = prev.catch(() => {}).then(() => current);
  orderLocks.set(key, chained);
  await prev.catch(() => {});
  try {
    return await task();
  } finally {
    release();
    if (orderLocks.get(key) === chained) orderLocks.delete(key);
  }
}

async function recalculateOrderFinances(orderId, isApproval = false) {
  return await withOrderLock(orderId, async () => {
    const order = await Order.findById(orderId);
    if (!order) return { order: null, wasPending: false };

    const approvedPayments = await Payment.find({ orderId: order._id, status: 'Approved' });
    const totalApproved = approvedPayments.reduce((sum, p) => sum + p.amount, 0);

    order.advancePaid = totalApproved;
    order.balanceDue = Math.max(0, order.totalAmount - totalApproved);
    order.paymentStatus = totalApproved >= order.totalAmount ? 'Paid' : (totalApproved > 0 ? 'Partial' : 'Unpaid');

    const check = evaluateRateLock(order.goldRateLock, totalApproved);
    if (check.isLocked && !order.goldRateLock?.isLocked) {
      const prev = order.goldRateLock?.toObject?.() || order.goldRateLock || {};
      order.goldRateLock = { ...prev, isLocked: true, lockedRate: check.lockedRate, lockedAt: check.lockedAt, karat: check.karat };
    }

    const wasPending = order.orderStatus === 'Pending';
    if (wasPending && isApproval) order.orderStatus = 'Confirmed';
    await order.save();
    return { order, wasPending: wasPending && isApproval };
  });
}

async function handleRaceConflict(orderId, paymentId, flow) {
  const latest = await Payment.findOne({ _id: paymentId, orderId });
  if (!latest) throw notFound('Payment transaction not found for this order');
  const isApprove = flow === 'approve';
  const msg = latest.status === 'Approved'
    ? (isApprove ? 'Payment has already been approved' : 'Cannot reject an already approved payment')
    : latest.status === 'Rejected'
      ? (isApprove ? 'Cannot approve a rejected payment' : 'Payment has already been rejected')
      : 'Payment is no longer pending verification';
  throw badRequest(msg);
}

export async function approvePaymentTransaction(orderId, paymentId, adminUser) {
  const order = await Order.findById(orderId);
  if (!order) throw notFound('Order not found');

  const existingPayment = await Payment.findOne({ _id: paymentId, orderId: order._id });
  if (!existingPayment) throw notFound('Payment transaction not found for this order');
  if (existingPayment.status === 'Approved') throw badRequest('Payment has already been approved');
  if (existingPayment.status === 'Rejected') throw badRequest('Cannot approve a rejected payment');

  const payment = await Payment.findOneAndUpdate(
    { _id: paymentId, orderId: order._id, status: 'Pending' },
    {
      $set: {
        status: 'Approved',
        approvedBy: adminUser?.email || adminUser?.name || 'Administrator',
        approvedAt: new Date(),
        rejectionReason: '',
        receiptNumber: existingPayment.receiptNumber || generateReceiptNumber()
      }
    },
    { returnDocument: 'after' }
  );

  if (!payment) await handleRaceConflict(order._id, paymentId, 'approve');

  const { order: updatedOrder, wasPending } = await recalculateOrderFinances(order._id, true);
  const receipt = formatPaymentReceipt(updatedOrder, payment);
  await sendCustomerPaymentApprovedEmail({ order: updatedOrder, payment, receipt }).catch(() => null);
  if (wasPending) await sendCustomerOrderStatusEmail({ order: updatedOrder, newStatus: 'Confirmed' }).catch(() => null);

  return { order: updatedOrder, payment, receipt };
}

export async function rejectPaymentTransaction(orderId, paymentId, reason, adminUser) {
  const order = await Order.findById(orderId);
  if (!order) throw notFound('Order not found');

  const existingPayment = await Payment.findOne({ _id: paymentId, orderId: order._id });
  if (!existingPayment) throw notFound('Payment transaction not found for this order');
  if (existingPayment.status === 'Rejected') throw badRequest('Payment has already been rejected');
  if (existingPayment.status === 'Approved') throw badRequest('Cannot reject an already approved payment');

  const payment = await Payment.findOneAndUpdate(
    { _id: paymentId, orderId: order._id, status: 'Pending' },
    {
      $set: {
        status: 'Rejected',
        rejectedBy: adminUser?.email || adminUser?.name || 'Administrator',
        rejectedAt: new Date(),
        rejectionReason: String(reason || 'Payment unverified or rejected by administrator').trim()
      }
    },
    { returnDocument: 'after' }
  );

  if (!payment) await handleRaceConflict(order._id, paymentId, 'reject');

  const { order: updatedOrder } = await recalculateOrderFinances(order._id, false);
  await sendCustomerPaymentRejectedEmail({ order: updatedOrder, payment }).catch(() => null);

  return { order: updatedOrder, payment };
}
