import path from 'path';
import fs from 'fs';
import { BASE_URL } from './seo.utils.js';
import { injectOpenGraphMeta, escapeHtml } from './galleryPreview.utils.js';
import { resolveCategoryMeta } from './categoryMeta.js';
import { buildPublicPageGraph, SSR_NAVIGATION_HTML } from './seoStructuredData.js';
import { PUBLIC_PAGES_META } from './publicPages.meta.js';

let cachedHtml = null;

function loadBaseHtml(publicDir) {
  if (cachedHtml && process.env.NODE_ENV === 'production') return cachedHtml;
  const p = path.join(publicDir, 'index.html');
  if (fs.existsSync(p)) {
    cachedHtml = fs.readFileSync(p, 'utf-8');
    return cachedHtml;
  }
  return null;
}

export function renderPublicPageHtml(publicDir, rawPath = '/') {
  const cleanPath = rawPath === '/' ? '/' : rawPath.replace(/\/+$/, '').toLowerCase();
  let pageMeta = PUBLIC_PAGES_META[cleanPath];

  if (!pageMeta && cleanPath.startsWith('/collections/')) {
    const match = cleanPath.match(/^\/collections\/([^/?#]+)/);
    if (match) pageMeta = resolveCategoryMeta(match[1]);
  }

  if (!pageMeta) return null;

  const baseHtml = loadBaseHtml(publicDir);
  if (!baseHtml) return null;

  const metaPayload = {
    escapedFullTitle: escapeHtml(pageMeta.title),
    escapedTitle: escapeHtml(pageMeta.title),
    escapedDescription: escapeHtml(pageMeta.description),
    canonicalUrl: pageMeta.canonicalUrl,
    escapedCanonicalUrl: escapeHtml(pageMeta.canonicalUrl),
    imageUrl: `${BASE_URL}/og-image.jpg`,
    escapedImageUrl: `${BASE_URL}/og-image.jpg`,
    ogType: 'website',
    price: null,
    pageGraphJsonLd: buildPublicPageGraph(cleanPath, pageMeta),
    ssrNavHtml: SSR_NAVIGATION_HTML
  };

  return injectOpenGraphMeta(baseHtml, metaPayload);
}
