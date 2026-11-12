import { BASE_URL } from './seo.utils.js';

export const INDEXNOW_KEY = process.env.INDEXNOW_KEY || 'khalilandsons2026indexnow';

export function getIndexNowKey() {
  return INDEXNOW_KEY;
}

export async function notifySearchEngines({ id, type = 'URL_UPDATED' } = {}) {
  const sitemapUrl = `${BASE_URL}/sitemap.xml`;
  const targetUrls = [
    sitemapUrl,
    `${BASE_URL}/shop`,
    `${BASE_URL}/gallery`
  ];
  if (id) {
    targetUrls.unshift(`${BASE_URL}/product/${id}`);
    targetUrls.unshift(`${BASE_URL}/masterpieces/${id}`);
  }

  const pingPromises = [];

  try {
    const googlePingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
    pingPromises.push(
      fetch(googlePingUrl, { signal: AbortSignal.timeout(4000) }).catch(() => null)
    );
  } catch {}

  try {
    const indexNowPayload = {
      host: 'khalilandsonsjewellers.com',
      key: INDEXNOW_KEY,
      keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
      urlList: targetUrls
    };
    pingPromises.push(
      fetch('https://api.indexnow.org/indexnow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(indexNowPayload),
        signal: AbortSignal.timeout(4000)
      }).catch(() => null)
    );
  } catch {}

  if (process.env.GOOGLE_INDEXING_WEBHOOK_URL) {
    try {
      pingPromises.push(
        fetch(process.env.GOOGLE_INDEXING_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: id ? `${BASE_URL}/product/${id}` : `${BASE_URL}/shop`,
            type,
            sitemapUrl,
            timestamp: new Date().toISOString()
          }),
          signal: AbortSignal.timeout(4000)
        }).catch(() => null)
      );
    } catch {}
  }

  Promise.allSettled(pingPromises).catch(() => null);
}

