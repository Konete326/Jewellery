export function normalizeOrderItem(item) {
  let size = typeof item?.size === 'string' ? item.size.trim() : '';
  if (!size && typeof item?.title === 'string') {
    const match = item.title.match(/\[Size:\s*([^\]]+)\]/i);
    if (match && match[1]) size = match[1].trim();
  }
  return { ...item, size };
}

export function sanitizeCustomerOrder(order) {
  if (!order) return null;
  const raw = typeof order.toObject === 'function' ? order.toObject() : { ...order };
  delete raw.internalNotes;
  delete raw.notificationLog;

  if (raw.collectionRecord) {
    raw.collectionRecord = {
      collectedAt: raw.collectionRecord.collectedAt || null,
      collectedBy: raw.collectionRecord.collectedBy || ''
    };
  }

  return raw;
}

export function sanitizeCustomerPayment(payment) {
  if (!payment) return null;
  const raw = typeof payment.toObject === 'function' ? payment.toObject() : { ...payment };
  delete raw.notes;
  delete raw.approvedBy;
  delete raw.rejectedBy;

  if (raw.status === 'Rejected') {
    raw.rejectionReason = 'Payment reference could not be verified against bank records';
  } else {
    delete raw.rejectionReason;
  }

  return raw;
}

export function sanitizeCustomerReceipt(receipt) {
  if (!receipt) return null;
  const copy = { ...receipt };
  if (copy.approval) {
    copy.approval = {
      status: copy.approval.status,
      approvedAt: copy.approval.approvedAt || null
    };
  }
  return copy;
}

