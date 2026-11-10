import path from 'path';
import fs from 'fs';
import { BASE_URL } from './seo.utils.js';
import { injectOpenGraphMeta, escapeHtml } from './galleryPreview.utils.js';
import { resolveCategoryMeta } from './categoryMeta.js';
import { buildPublicPageGraph, SSR_NAVIGATION_HTML } from './seoStructuredData.js';

const PUBLIC_PAGES_META = {
  '/': {
    title: 'Khalil & Sons Jewellers | Master Goldsmithing & Bridal Jewellery Karachi',
    description: 'Khalil & Sons Jewellers — Master goldsmiths since 1992 in Murshid Sunaar Tower, Saddar, Karachi. Specializing in certified 22K, 21K and 18K gold bridal jewellery heirlooms, uncut Polki diamonds, and lifetime hallmark guarantee.',
    canonicalUrl: `${BASE_URL}/`
  },
  '/gallery': {
    title: 'Haute Joaillerie Gallery & Bridal Heirlooms | Khalil & Sons Jewellers',
    description: 'Explore the complete Khalil & Sons fine jewellery collection. Certified 22K, 21K and 18K gold bridal sets, Polki diamond heirlooms, kadas, and gulubands in Saddar, Karachi.',
    canonicalUrl: `${BASE_URL}/gallery`
  },
  '/shop': {
    title: 'Haute Joaillerie & Bridal Collections | Khalil & Sons Jewellers',
    description: 'Explore the complete Khalil & Sons outlet catalog. Certified 22K & 24K hallmarked gold bridal sets, polki necklaces, solitaires, kadas, and artisanal bullion in Saddar, Karachi.',
    canonicalUrl: `${BASE_URL}/shop`
  },
  '/collections': {
    title: 'Haute Joaillerie & Bridal Collections | Khalil & Sons Jewellers',
    description: 'Explore the complete Khalil & Sons outlet catalog. Certified 22K & 24K hallmarked gold bridal sets, polki necklaces, solitaires, kadas, and artisanal bullion in Saddar, Karachi.',
    canonicalUrl: `${BASE_URL}/shop`
  },
  '/rates': {
    title: 'Live Gold & Silver Rates Karachi | Khalil & Sons Jewellers',
    description: 'Check today live 24K, 22K, 21K, and 18K gold and pure silver rates in Karachi Sarafa Market. Certified hallmark pricing by Khalil & Sons Jewellers, Saddar.',
    canonicalUrl: `${BASE_URL}/rates`
  },
  '/gold-rates': {
    title: 'Live Gold & Silver Rates Karachi | Khalil & Sons Jewellers',
    description: 'Check today live 24K, 22K, 21K, and 18K gold and pure silver rates in Karachi Sarafa Market. Certified hallmark pricing by Khalil & Sons Jewellers, Saddar.',
    canonicalUrl: `${BASE_URL}/rates`
  },
  '/about': {
    title: 'Our Heritage & 3-Decade Legacy (Est. 1992) | Khalil & Sons Jewellers',
    description: 'The story of Khalil & Sons Jewellers. Founded in 1992 by Mr. Khalil Ahmed in Murshid Bazaar, Saddar, Karachi. Three decades of authentic Mughal filigree, certified 22K/21K/18K purity, and bespoke bridal goldsmithing.',
    canonicalUrl: `${BASE_URL}/about`
  },
  '/about-us': {
    title: 'Our Heritage & 3-Decade Legacy (Est. 1992) | Khalil & Sons Jewellers',
    description: 'The story of Khalil & Sons Jewellers. Founded in 1992 by Mr. Khalil Ahmed in Murshid Bazaar, Saddar, Karachi. Three decades of authentic Mughal filigree, certified 22K/21K/18K purity, and bespoke bridal goldsmithing.',
    canonicalUrl: `${BASE_URL}/about`
  },
  '/contact': {
    title: 'Contact Atelier & Showroom | Saddar Karachi | Khalil & Sons Jewellers',
    description: 'Contact Khalil & Sons Jewellers at Shop #2, Murshid Sunaar Tower, Dr. Daud Pota Road, Saddar, Karachi. Call +92 21 35670868 or WhatsApp +92 333 3213613 for private consultation.',
    canonicalUrl: `${BASE_URL}/contact`
  },
  '/contact-us': {
    title: 'Contact Atelier & Showroom | Saddar Karachi | Khalil & Sons Jewellers',
    description: 'Contact Khalil & Sons Jewellers at Shop #2, Murshid Sunaar Tower, Dr. Daud Pota Road, Saddar, Karachi. Call +92 21 35670868 or WhatsApp +92 333 3213613 for private consultation.',
    canonicalUrl: `${BASE_URL}/contact`
  },
  '/reviews': {
    title: 'Client Reviews & Masterpiece Appraisals | Khalil & Sons Jewellers',
    description: 'Read authentic client evaluations and certified gold appraisals for bridal sets, bangles, and diamond jewelry from Khalil & Sons, Saddar, Karachi.',
    canonicalUrl: `${BASE_URL}/reviews`
  },
  '/track-order': {
    title: 'Track Your Jewellery Order | Khalil & Sons Jewellers',
    description: 'Track the real-time artisan crafting and delivery status of your bespoke bridal jewellery order from Khalil & Sons Jewellers.',
    canonicalUrl: `${BASE_URL}/track-order`
  },
  '/track': {
    title: 'Track Your Jewellery Order | Khalil & Sons Jewellers',
    description: 'Track the real-time artisan crafting and delivery status of your bespoke bridal jewellery order from Khalil & Sons Jewellers.',
    canonicalUrl: `${BASE_URL}/track-order`
  }
};

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
