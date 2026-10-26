function parseNumber(str, fallback) {
  if (!str) return fallback;
  const cleaned = str.replace(/,/g, '').trim();
  const val = parseFloat(cleaned);
  return Number.isNaN(val) || val <= 0 ? fallback : val;
}

export async function scrapeLiveMarketRates() {
  const result = {
    gold24kTola: 419000,
    gold24kTenGram: 359230,
    gold24kGram: 35923,
    silver24kTola: 6794,
    silver24kTenGram: 5824.9,
    silver24kGram: 582.49,
    source: 'Karachi Sarafa Jewellers Association (gold.pk)',
    timestamp: new Date()
  };

  try {
    const goldController = new AbortController();
    const goldTimeout = setTimeout(() => goldController.abort(), 6000);
    const goldRes = await fetch('https://gold.pk/', {
      signal: goldController.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    clearTimeout(goldTimeout);

    if (goldRes.ok) {
      const goldHtml = await goldRes.text();
      const tolaMatch = goldHtml.match(/<p\s+class=['"]goldratehome['"]>\s*Rs\.?\s*([0-9.,]+)<\/p>\s*<p>[^<]*?\(1\s*Tola\)/i);
      const tenGmMatch = goldHtml.match(/<p\s+class=['"]goldratehome['"]>\s*Rs\.?\s*([0-9.,]+)<\/p>\s*<p>[^<]*?\(10\s*Gram\)/i);
      const oneGmMatch = goldHtml.match(/<p\s+class=['"]goldratehome['"]>\s*Rs\.?\s*([0-9.,]+)<\/p>\s*<p>[^<]*?\(1\s*Gram\)/i);

      if (tolaMatch) result.gold24kTola = parseNumber(tolaMatch[1], result.gold24kTola);
      if (tenGmMatch) result.gold24kTenGram = parseNumber(tenGmMatch[1], result.gold24kTenGram);
      if (oneGmMatch) result.gold24kGram = parseNumber(oneGmMatch[1], result.gold24kGram);
    }
  } catch (e) {}

  try {
    const silverController = new AbortController();
    const silverTimeout = setTimeout(() => silverController.abort(), 6000);
    const silverRes = await fetch('https://gold.pk/pakistan-silver-rates-xagp.php', {
      signal: silverController.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    clearTimeout(silverTimeout);

    if (silverRes.ok) {
      const silverHtml = await silverRes.text();
      const sTolaMatch = silverHtml.match(/<p\s+class=['"]goldratehome['"]>\s*Rs\.?\s*([0-9.,]+)<\/p>\s*<p>[^<]*?1\s*Tola/i);
      const sTenGmMatch = silverHtml.match(/<p\s+class=['"]goldratehome['"]>\s*Rs\.?\s*([0-9.,]+)<\/p>\s*<p>[^<]*?10\s*Gram/i);
      const sOneGmMatch = silverHtml.match(/<p\s+class=['"]goldratehome['"]>\s*Rs\.?\s*([0-9.,]+)<\/p>\s*<p>[^<]*?1\s*Gram/i);

      if (sTolaMatch) result.silver24kTola = parseNumber(sTolaMatch[1], result.silver24kTola);
      if (sTenGmMatch) result.silver24kTenGram = parseNumber(sTenGmMatch[1], result.silver24kTenGram);
      if (sOneGmMatch) result.silver24kGram = parseNumber(sOneGmMatch[1], result.silver24kGram);
    }
  } catch (e) {}

  return result;
}
