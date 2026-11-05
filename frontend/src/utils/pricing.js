export function formatPKR(amount) {
  const num = Math.round(Number(amount) || 0);
  return 'PKR ' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function isItemPriceConfirmed(item) {
  if (!item || typeof item !== 'object') return false;
  if (item.isEstimated === true) return false;
  if (item.hasConfirmedPrice === true && Number(item.numericPrice || item.price) > 0) {
    return true;
  }
  if (item.pricingSource === 'catalog' || item.pricingSource === 'product' || item.pricingSource === 'calculated') {
    return Number(item.numericPrice || item.price) > 0;
  }
  if (item.calculatedPrice !== undefined && item.calculatedPrice !== null && Number(item.calculatedPrice) > 0) {
    return true;
  }
  if (Number(item.numericPrice || item.price) > 0 && (Number(item.netWeight) > 0 || Number(item.grossWeight) > 0 || Number(item.makingCharges) > 0)) {
    return true;
  }
  return false;
}

export function getEstimatedPiecePrice(piece = {}) {
  const rawNum = piece.calculatedPrice ?? piece.numericPrice ?? piece.price;
  const numPrice = typeof rawNum === 'string'
    ? parseFloat(rawNum.replace(/[^0-9.]/g, ''))
    : Number(rawNum);

  const realPurity = piece.purity ? String(piece.purity).trim() : '';
  const hasDirectCatalogPrice = Boolean(
    (piece.calculatedPrice !== undefined && piece.calculatedPrice !== null && Number(piece.calculatedPrice) > 0) ||
    (piece.price !== undefined && piece.price !== null && Number(piece.price) > 0 && (piece.grossWeight || piece.netWeight || piece.makingCharges))
  );

  if (Number.isFinite(numPrice) && numPrice > 0 && piece.isEstimated !== true && hasDirectCatalogPrice) {
    const rounded = Math.round(numPrice);
    return {
      numericPrice: rounded,
      formattedPrice: formatPKR(rounded),
      weightEstimate: piece.weightEstimate || (piece.netWeight ? `${piece.netWeight}g` : 'Standard Weight'),
      purity: realPurity || '22K',
      isEstimated: false,
      hasConfirmedPrice: true,
      pricingSource: 'catalog'
    };
  }

  const category = (piece.category || '').toLowerCase();

  let basePrice = 385000;
  let weight = '1.0 Tola (11.66g)';
  let fallbackPurity = '22K';

  if (category.includes('bridal')) {
    basePrice = 950000;
    weight = '2.5 Tola (29.16g)';
    fallbackPurity = '22K';
  } else if (category.includes('necklace') || category.includes('choker') || category.includes('guluband')) {
    basePrice = 460000;
    weight = '1.2 Tola (14.00g)';
    fallbackPurity = '22K';
  } else if (category.includes('bangle') || category.includes('kada')) {
    basePrice = 385000;
    weight = '1.0 Tola (11.66g)';
    fallbackPurity = '22K';
  } else if (category.includes('ring') || category.includes('solitaire')) {
    basePrice = 135000;
    weight = '0.35 Tola (4.08g)';
    fallbackPurity = '21K';
  } else if (category.includes('earring') || category.includes('jhumka')) {
    basePrice = 175000;
    weight = '0.45 Tola (5.25g)';
    fallbackPurity = '22K';
  } else if (category.includes('polki') || category.includes('jadau') || category.includes('kundan')) {
    basePrice = 620000;
    weight = '1.6 Tola (18.66g)';
    fallbackPurity = '22K';
  } else if (category.includes('pendant') || category.includes('chain')) {
    basePrice = 195000;
    weight = '0.5 Tola (5.83g)';
    fallbackPurity = '22K';
  } else if (category.includes('bullion') || category.includes('coin') || category.includes('bar')) {
    basePrice = 419000;
    weight = '1.0 Tola (11.664g)';
    fallbackPurity = '24K';
  }

  return {
    numericPrice: basePrice,
    formattedPrice: formatPKR(basePrice),
    weightEstimate: weight,
    purity: realPurity || fallbackPurity,
    isEstimated: true,
    hasConfirmedPrice: false,
    pricingSource: 'estimate'
  };
}

export function sanitizeQuantity(val) {
  if (typeof val === 'number') {
    return Math.max(1, Math.min(99, Math.floor(val)));
  }
  const clean = String(val || '').replace(/[^0-9]/g, '');
  if (!clean) return 1;
  const num = parseInt(clean, 10);
  return Math.max(1, Math.min(99, num));
}

export function sanitizePhoneInput(val) {
  return String(val || '').replace(/[^0-9+\s\-]/g, '').slice(0, 18);
}

export function sanitizeNameInput(val) {
  return String(val || '').replace(/[^a-zA-Z\s]/g, '').slice(0, 50);
}
