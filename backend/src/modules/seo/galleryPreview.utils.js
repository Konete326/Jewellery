import { BASE_URL, optimizeCloudinaryUrl } from './seo.utils.js';
import { serializeJsonLd } from './productSchema.js';

export function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function resolveAbsoluteImageUrl(rawImage) {
  if (!rawImage || typeof rawImage !== 'string') {
    return `${BASE_URL}/og-image.jpg`;
  }
  const trimmed = rawImage.trim();
  if (!trimmed) {
    return `${BASE_URL}/og-image.jpg`;
  }
  const optimized = optimizeCloudinaryUrl(trimmed);
  if (/^https?:\/\//i.test(optimized)) {
    return optimized;
  }
  const cleanPath = optimized.startsWith('/') ? optimized : `/${optimized}`;
  return `${BASE_URL}${cleanPath}`;
}

export function injectOpenGraphMeta(html, meta) {
  let updated = html;
  const canonical = meta.escapedCanonicalUrl || escapeHtml(meta.canonicalUrl);
  const imgUrl = meta.escapedImageUrl || escapeHtml(meta.imageUrl);

  updated = updated.replace(/<title>.*?<\/title>/i, `<title>${meta.escapedFullTitle}</title>`);
  updated = updated.replace(/<meta name="description" content=".*?"\s*\/?>/i, `<meta name="description" content="${meta.escapedDescription}" />`);
  updated = updated.replace(/<link rel="canonical" href=".*?"\s*\/?>/i, `<link rel="canonical" href="${canonical}" />`);
  updated = updated.replace(/<meta property="og:type" content=".*?"\s*\/?>/i, `<meta property="og:type" content="${meta.ogType}" />`);
  updated = updated.replace(/<meta property="og:url" content=".*?"\s*\/?>/i, `<meta property="og:url" content="${canonical}" />`);
  updated = updated.replace(/<meta property="og:title" content=".*?"\s*\/?>/i, `<meta property="og:title" content="${meta.escapedFullTitle}" />`);
  updated = updated.replace(/<meta property="og:description" content=".*?"\s*\/?>/i, `<meta property="og:description" content="${meta.escapedDescription}" />`);
  updated = updated.replace(/<meta property="og:image" content=".*?"\s*\/?>/i, `<meta property="og:image" content="${imgUrl}" />`);
  updated = updated.replace(/<meta property="og:image:secure_url" content=".*?"\s*\/?>/i, `<meta property="og:image:secure_url" content="${imgUrl}" />`);
  updated = updated.replace(/<meta property="og:image:alt" content=".*?"\s*\/?>/i, `<meta property="og:image:alt" content="${meta.escapedTitle}" />`);
  updated = updated.replace(/<meta name="twitter:title" content=".*?"\s*\/?>/i, `<meta name="twitter:title" content="${meta.escapedFullTitle}" />`);
  updated = updated.replace(/<meta name="twitter:description" content=".*?"\s*\/?>/i, `<meta name="twitter:description" content="${meta.escapedDescription}" />`);
  updated = updated.replace(/<meta name="twitter:image" content=".*?"\s*\/?>/i, `<meta name="twitter:image" content="${imgUrl}" />`);

  if (meta.price !== null && meta.price !== undefined) {
    const priceTags = [
      `<meta property="product:price:amount" content="${Math.round(meta.price)}" />`,
      `<meta property="product:price:currency" content="PKR" />`,
      `<meta property="og:price:amount" content="${Math.round(meta.price)}" />`,
      `<meta property="og:price:currency" content="PKR" />`
    ].join('\n    ');
    updated = updated.replace(/<\/head>/i, `    ${priceTags}\n  </head>`);
  }

  if (meta.jsonLd) {
    const jsonTag = `<script type="application/ld+json" id="product-json-ld">${serializeJsonLd(meta.jsonLd)}</script>`;
    updated = updated.replace(/<\/head>/i, `    ${jsonTag}\n  </head>`);
  }

  return updated;
}

export function generateFallbackHtml(meta) {
  const canonical = meta.escapedCanonicalUrl || escapeHtml(meta.canonicalUrl);
  const imgUrl = meta.escapedImageUrl || escapeHtml(meta.imageUrl);
  const priceTags = (meta.price !== null && meta.price !== undefined)
    ? `\n    <meta property="product:price:amount" content="${Math.round(meta.price)}" />\n    <meta property="product:price:currency" content="PKR" />\n    <meta property="og:price:amount" content="${Math.round(meta.price)}" />\n    <meta property="og:price:currency" content="PKR" />`
    : '';
  const jsonLdTag = meta.jsonLd
    ? `\n    <script type="application/ld+json" id="product-json-ld">${serializeJsonLd(meta.jsonLd)}</script>`
    : '';

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${meta.escapedFullTitle}</title>
    <meta name="description" content="${meta.escapedDescription}" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:type" content="${meta.ogType}" />
    <meta property="og:site_name" content="Khalil & Sons Jewellers" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:title" content="${meta.escapedFullTitle}" />
    <meta property="og:description" content="${meta.escapedDescription}" />
    <meta property="og:image" content="${imgUrl}" />
    <meta property="og:image:secure_url" content="${imgUrl}" />
    <meta property="og:image:alt" content="${meta.escapedTitle}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${meta.escapedFullTitle}" />
    <meta name="twitter:description" content="${meta.escapedDescription}" />
    <meta name="twitter:image" content="${imgUrl}" />${priceTags}${jsonLdTag}
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`;
}
