const TOLA_GRAMS = 11.6638;

export function calculateAllRates(gold24kTola, silver24kTola, customValues = {}) {
  const g24Tola = Number(gold24kTola) || 419000;
  const g24TenGram = customValues.gold24kTenGram || Math.round((g24Tola / TOLA_GRAMS) * 10);
  const g24Gram = customValues.gold24kGram || Math.round(g24Tola / TOLA_GRAMS);
  const g24Ounce = customValues.gold24kOunce || Math.round(g24Tola * 2.43056);

  const gold = {
    '24K': {
      tola: g24Tola,
      tenGram: g24TenGram,
      gram: g24Gram,
      ounce: g24Ounce
    },
    '22K': {
      tola: customValues.gold22kTola || Math.round(g24Tola * (22 / 24)),
      tenGram: customValues.gold22kTenGram || Math.round(g24TenGram * (22 / 24)),
      gram: customValues.gold22kGram || Math.round(g24Gram * (22 / 24)),
      ounce: 0
    },
    '21K': {
      tola: customValues.gold21kTola || Math.round(g24Tola * (21 / 24)),
      tenGram: customValues.gold21kTenGram || Math.round(g24TenGram * (21 / 24)),
      gram: customValues.gold21kGram || Math.round(g24Gram * (21 / 24)),
      ounce: 0
    },
    '18K': {
      tola: customValues.gold18kTola || Math.round(g24Tola * (18 / 24)),
      tenGram: customValues.gold18kTenGram || Math.round(g24TenGram * (18 / 24)),
      gram: customValues.gold18kGram || Math.round(g24Gram * (18 / 24)),
      ounce: 0
    }
  };

  const s24Tola = Number(silver24kTola) || 6794;
  const s24TenGram = customValues.silver24kTenGram || Math.round((s24Tola / TOLA_GRAMS) * 10 * 10) / 10;
  const s24Gram = customValues.silver24kGram || Math.round((s24Tola / TOLA_GRAMS) * 100) / 100;

  const silver = {
    '24K': {
      tola: s24Tola,
      tenGram: s24TenGram,
      gram: s24Gram,
      ounce: 0
    },
    '22K': {
      tola: customValues.silver22kTola || Math.round(s24Tola * 0.925),
      tenGram: customValues.silver22kTenGram || Math.round((s24TenGram * 0.925) * 10) / 10,
      gram: customValues.silver22kGram || Math.round((s24Gram * 0.925) * 100) / 100,
      ounce: 0
    }
  };

  return { gold, silver };
}
