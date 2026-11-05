export function generateReceiptNumber() {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `KS-RCP-${dateStr}-${rand}`;
}

export function formatPaymentReceipt(order, payment) {
  if (!order || !payment) return null;
  return {
    receiptNumber: payment.receiptNumber || '',
    orderNumber: order.orderNumber,
    orderId: String(order._id),
    paymentId: String(payment._id),
    amount: payment.amount,
    currency: 'PKR',
    paymentType: payment.paymentType,
    paymentReference: payment.paymentReference || '',
    transactionDate: payment.createdAt,
    customer: {
      name: order.customer?.name || payment.customer?.name,
      phone: order.customer?.phone || payment.customer?.phone,
      email: order.customer?.email || payment.customer?.email || '',
      city: order.customer?.city || 'Karachi'
    },
    bankAccount: {
      bankName: payment.bankAccountSnapshot?.bankName || '',
      accountTitle: payment.bankAccountSnapshot?.accountTitle || '',
      accountNumber: payment.bankAccountSnapshot?.accountNumber || '',
      iban: payment.bankAccountSnapshot?.iban || '',
      accountType: payment.bankAccountSnapshot?.accountType || 'Bank Account'
    },
    approval: {
      status: payment.status,
      approvedBy: payment.approvedBy || '',
      approvedAt: payment.approvedAt || null,
      rejectionReason: payment.rejectionReason || ''
    },
    goldRateLock: {
      isLocked: Boolean(order.goldRateLock?.isLocked),
      lockedRate: order.goldRateLock?.lockedRate || 0,
      karat: order.goldRateLock?.karat || '22K',
      lockedAt: order.goldRateLock?.lockedAt || null,
      snapshotRate: order.goldRateLock?.snapshotRate || 0,
      minAdvanceRequired: order.goldRateLock?.minAdvanceRequired || 0
    },
    financialSummary: {
      totalAmount: order.totalAmount,
      advancePaid: order.advancePaid,
      balanceDue: order.balanceDue,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus
    },
    items: (order.items || []).map((it) => ({
      title: it.title,
      category: it.category,
      purity: it.purity,
      size: it.size || '',
      quantity: it.quantity,
      price: it.price
    }))
  };
}
