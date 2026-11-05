export function canonicalPhone(phone) {
  let digits = String(phone || '').replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('0092')) digits = digits.slice(4);
  else if (digits.startsWith('92') && digits.length >= 11) digits = digits.slice(2);
  else if (digits.startsWith('0')) digits = digits.slice(1);
  if (digits.length === 10 && digits.startsWith('3')) {
    return '92' + digits;
  }
  if (digits.length >= 9 && digits.length <= 11) {
    return '92' + digits;
  }
  return digits;
}

export function matchOrderPhone(registeredPhone, inputPhone) {
  const c1 = canonicalPhone(registeredPhone);
  const c2 = canonicalPhone(inputPhone);
  if (!c1 || !c2) return false;
  return c1 === c2;
}

function maskName(name) {
  if (!name || typeof name !== 'string') return 'Valued Patron';
  const parts = name.trim().split(/\s+/);
  return parts
    .map((p) => (p.length <= 2 ? p[0] + '*' : p[0] + '*'.repeat(Math.min(p.length - 2, 4)) + p.slice(-1)))
    .join(' ');
}

function maskPhone(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  if (digits.length < 7) return '****';
  return digits.slice(0, 4) + '****' + digits.slice(-3);
}

export function formatTrackingResponse(order) {
  const rawCustomer = order.customer || {};
  return {
    orderNumber: order.orderNumber,
    orderStatus: order.orderStatus,
    paymentStatus: order.paymentStatus,
    fulfillmentType: order.fulfillmentType,
    totalAmount: order.totalAmount,
    advancePaid: order.advancePaid,
    balanceDue: order.balanceDue,
    goldRateLock: order.goldRateLock || { isLocked: false },
    tracking: order.tracking || { courier: '', trackingNumber: '' },
    collectionRecord: order.collectionRecord?.collectedAt ? {
      collectedAt: order.collectionRecord.collectedAt,
      collectedBy: order.collectionRecord.collectedBy || ''
    } : null,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    items: (order.items || []).map((it) => ({
      title: it.title,
      category: it.category,
      purity: it.purity,
      size: it.size || '',
      quantity: it.quantity,
      price: it.price,
      imageUrl: it.imageUrl
    })),
    customer: {
      name: maskName(rawCustomer.name),
      phone: maskPhone(rawCustomer.phone),
      city: rawCustomer.city || 'Karachi'
    }
  };
}
