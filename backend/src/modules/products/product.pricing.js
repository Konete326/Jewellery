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

  return {
    ...product,
    liveRatePerGram: ratePerGram,
    pureGoldCost,
    wastageCost,
    totalGoldCost,
    calculatedPrice: calculatedPrice > 0 ? calculatedPrice : (product.price || 0),
    minAdvanceToLock
  };
}

