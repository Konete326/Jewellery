const VALID_ORDER_TRANSITIONS = {
  Pending: ['Confirmed', 'Processing', 'Cancelled'],
  Confirmed: ['Processing', 'Ready', 'Cancelled'],
  Processing: ['Ready', 'Cancelled'],
  Ready: ['Delivered', 'Processing', 'Cancelled'],
  Delivered: [],
  Cancelled: []
};

export function validateOrderStatusTransition(currentStatus, newStatus) {
  if (!newStatus || currentStatus === newStatus) return true;
  const allowed = VALID_ORDER_TRANSITIONS[currentStatus] || [];
  if (!allowed.includes(newStatus)) {
    const err = new Error(
      `Invalid order status transition from '${currentStatus}' to '${newStatus}'. Order must follow preparation, ready-for-pickup, and collection lifecycle.`
    );
    err.statusCode = 400;
    throw err;
  }
  return true;
}

export function validatePaymentStatusTransition(currentStatus, newStatus) {
  if (!newStatus || currentStatus === newStatus) return true;
  if (currentStatus === 'Approved') {
    const err = new Error('Payment has already been approved and cannot transition to another status');
    err.statusCode = 400;
    throw err;
  }
  if (currentStatus === 'Rejected') {
    const err = new Error('Payment has already been rejected and cannot transition to another status');
    err.statusCode = 400;
    throw err;
  }
  return true;
}

