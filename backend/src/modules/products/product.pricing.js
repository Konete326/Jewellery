export function calculateProductPricing(product, currentRate) {
  const purity = product.purity || '22K';
  const ratePerGram = currentRate?.gold?.[purity]?.gram || 0;
  const netWeight = Number(product.netWeight) || 0;
  const pureGoldCost = Math.round(netWeight * ratePerGram);
  const wastagePercent = Number(product.wastagePercent) || 0;
  const wastageCost = Math.round(pureGoldCost * (wastagePercent / 100));
  const totalGoldCost = pureGoldCost + wastageCost;
  const makingCharges = Number(product.makingCharges) || 0;
  const stoneCharges = Number(product.stoneCharges) || 0;
  const calculatedPrice = totalGoldCost + makingCharges + stoneCharges;
  const minAdvanceToLock = Math.round(pureGoldCost * 0.9);

  const rawSupplier = product.supplierId;
  const isPopulated = rawSupplier && typeof rawSupplier === 'object' && rawSupplier.name;
  const supplierId = isPopulated ? String(rawSupplier._id) : (rawSupplier ? String(rawSupplier) : null);
  const supplierName = isPopulated ? rawSupplier.name : null;
  const supplier = isPopulated ? {
    _id: String(rawSupplier._id),
    name: rawSupplier.name,
    city: rawSupplier.city,
    phone: rawSupplier.phone,
    status: rawSupplier.status
  } : null;

  return {
    ...product,
    supplierId,
    supplierName,
    supplier,
    liveRatePerGram: ratePerGram,
    pureGoldCost,
    wastageCost,
    totalGoldCost,
    calculatedPrice: calculatedPrice > 0 ? calculatedPrice : (product.price || 0),
    minAdvanceToLock
  };
}

