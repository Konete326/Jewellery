import { createTransporter } from '../../utils/mailer.js';
import { Order } from './order.model.js';
import {
  renderPaymentApprovedHtml,
  renderPaymentRejectedHtml,
  renderOrderStatusHtml
} from './order.mail.templates.js';

let customTransporter = null;
export function setTestTransporter(transporter) {
  customTransporter = transporter;
}

const getTransporter = () => customTransporter || createTransporter();

async function recordAndSendNotification(order, { event, key, subject, html }) {
  const orderDoc = await Order.findById(order._id);
  if (!orderDoc) return { delivered: false, reason: 'order_not_found' };

  orderDoc.notificationLog = orderDoc.notificationLog || [];
  const recipient = (order.customer?.email || orderDoc.customer?.email || '').trim();

  if (!recipient) {
    const alreadySkipped = orderDoc.notificationLog.some(
      (n) => n.idempotencyKey === key && n.status === 'skipped'
    );
    if (!alreadySkipped) {
      orderDoc.notificationLog.push({
        event,
        recipient: '',
        status: 'skipped',
        reason: 'missing_recipient',
        sentAt: new Date(),
        idempotencyKey: key
      });
      await orderDoc.save().catch(() => null);
    }
    return { delivered: false, reason: 'missing_recipient', status: 'skipped' };
  }

  const alreadySent = orderDoc.notificationLog.some(
    (n) => n.idempotencyKey === key && n.status === 'sent'
  );
  if (alreadySent) {
    return { delivered: false, duplicate: true };
  }

  const from = process.env.SMTP_FROM || 'Khalil & Sons Jewellers <khalilandsonsjewellers@gmail.com>';
  try {
    const transporter = getTransporter();
    const result = await transporter.sendMail({ from, to: recipient, subject, html });

    orderDoc.notificationLog.push({
      event,
      recipient,
      status: 'sent',
      reason: '',
      sentAt: new Date(),
      idempotencyKey: key
    });
    await orderDoc.save();

    return { delivered: true, messageId: result?.messageId || 'sent', status: 'sent' };
  } catch (err) {
    orderDoc.notificationLog.push({
      event,
      recipient,
      status: 'failed',
      reason: 'smtp_error',
      sentAt: new Date(),
      idempotencyKey: key
    });
    await orderDoc.save().catch(() => null);

    return { delivered: false, error: err.message, status: 'failed', reason: 'smtp_error' };
  }
}

export async function sendCustomerPaymentApprovedEmail({ order, payment, receipt }) {
  const key = `payment_${payment._id}_approved`;
  const subject = `Payment Approved — Order ${order.orderNumber}`;
  const html = renderPaymentApprovedHtml({ order, payment, receipt });
  return recordAndSendNotification(order, { event: 'payment_approved', key, subject, html });
}

export async function sendCustomerPaymentRejectedEmail({ order, payment }) {
  const key = `payment_${payment._id}_rejected`;
  const subject = `Payment Verification Update — Order ${order.orderNumber}`;
  const html = renderPaymentRejectedHtml({ order, payment });
  return recordAndSendNotification(order, { event: 'payment_rejected', key, subject, html });
}

export async function sendCustomerOrderStatusEmail({ order, newStatus }) {
  const key = `order_${order._id}_status_${newStatus}`;
  let prefix = `Order ${newStatus}`;
  if (newStatus === 'Ready') prefix = 'Ready for Collection';
  if (newStatus === 'Delivered') prefix = 'Order Collected';
  const subject = `${prefix} — ${order.orderNumber}`;
  const html = renderOrderStatusHtml({ order, status: newStatus });
  return recordAndSendNotification(order, { event: `status_${newStatus.toLowerCase()}`, key, subject, html });
}
