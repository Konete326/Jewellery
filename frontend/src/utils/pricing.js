export function formatPKR(amount) {
  const num = Math.round(Number(amount) || 0);
  return 'PKR ' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function getEstimatedPiecePrice(piece = {}) {
  if (piece.numericPrice && Number(piece.numericPrice) > 0) {
    const num = Math.round(Number(piece.numericPrice));
    return {
      numericPrice: num,
      formattedPrice: formatPKR(num),
      weightEstimate: piece.weightEstimate || 'Custom Weight',
      purity: piece.purity || '22K (916.6)'
    };
  }

  const category = (piece.category || '').toLowerCase();

  let basePrice = 385000;
  let weight = '1.0 Tola (11.66g)';
  let purity = '22K (916.6)';

  if (category.includes('bridal')) {
    basePrice = 950000;
    weight = '2.5 Tola (29.16g)';
    purity = '22K (916.6)';
  } else if (category.includes('necklace') || category.includes('choker') || category.includes('guluband')) {
    basePrice = 460000;
    weight = '1.2 Tola (14.00g)';
    purity = '22K (916.6)';
  } else if (category.includes('bangle') || category.includes('kada')) {
    basePrice = 385000;
    weight = '1.0 Tola (11.66g)';
    purity = '22K (916.6)';
  } else if (category.includes('ring') || category.includes('solitaire')) {
    basePrice = 135000;
    weight = '0.35 Tola (4.08g)';
    purity = '21K (875.0)';
  } else if (category.includes('earring') || category.includes('jhumka')) {
    basePrice = 175000;
    weight = '0.45 Tola (5.25g)';
    purity = '22K (916.6)';
  } else if (category.includes('polki') || category.includes('jadau') || category.includes('kundan')) {
    basePrice = 620000;
    weight = '1.6 Tola (18.66g)';
    purity = '22K (916.6)';
  } else if (category.includes('pendant') || category.includes('chain')) {
    basePrice = 195000;
    weight = '0.5 Tola (5.83g)';
    purity = '22K (916.6)';
  } else if (category.includes('bullion') || category.includes('coin') || category.includes('bar')) {
    basePrice = 419000;
    weight = '1.0 Tola (11.664g)';
    purity = '24K (999.0)';
  }

  return {
    numericPrice: basePrice,
    formattedPrice: formatPKR(basePrice),
    weightEstimate: weight,
    purity
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

