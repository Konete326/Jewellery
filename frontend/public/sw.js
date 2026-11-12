const CACHE_NAME = 'khalil-sons-pwa-v4';
const CACHE_PREFIX = 'khalil-sons-pwa-';
const MAX_CACHE_ENTRIES = 35;
const MAX_ENTRY_BYTES = 2.5 * 1024 * 1024;
const MAX_TOTAL_BYTES = 20 * 1024 * 1024;

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/logo.png',
  '/favicon.svg'
];

const PROTECTED_ASSETS = new Set(PRECACHE_ASSETS);

const EXCLUDED_EXTENSIONS = [
  '.glb',
  '.gltf',
  '.mp4',
  '.webm',
  '.ogg',
  '.mov',
  '.avi',
  '.mkv',
  '.mp3',
  '.wav',
  '.flac',
  '.aac',
  '.zip',
  '.tar',
  '.gz',
  '.pdf',
  '.map'
];

const ALLOWED_STATIC_EXTENSIONS = [
  '.js',
  '.mjs',
  '.css',
  '.woff',
  '.woff2',
  '.ttf',
  '.eot',
  '.svg',
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.ico'
];

const EXCLUDED_PATH_PREFIXES = [
  '/api',
  '/admin',
  '/auth',
  '/orders',
  '/user',
  '/account'
];

function isBasicCacheable(req, res) {
  if (!res || res.status !== 200 || res.type !== 'basic') return false;
  const url = new URL(typeof req === 'string' ? req : req.url, self.location.origin);
  const path = url.pathname.toLowerCase().replace(/\/+$/, '');

  for (const prefix of EXCLUDED_PATH_PREFIXES) {
    if (path.startsWith(prefix)) return false;
  }

  for (const ext of EXCLUDED_EXTENSIONS) {
    if (path.endsWith(ext)) return false;
  }

  if (req.headers && (req.headers.has('range') || req.headers.has('authorization'))) return false;

  const contentType = (res.headers.get('content-type') || '').toLowerCase();
  if (
    contentType.includes('video/') ||
    contentType.includes('audio/') ||
    contentType.includes('model/') ||
    contentType.includes('application/octet-stream') ||
    contentType.includes('application/pdf')
  ) {
    return false;
  }

  if (contentType.includes('application/json') && !path.endsWith('/manifest.json')) {
    return false;
  }

  if (PROTECTED_ASSETS.has(url.pathname)) return true;

  const hasAllowedExt = ALLOWED_STATIC_EXTENSIONS.some((ext) => path.endsWith(ext));
  if (!hasAllowedExt) return false;

  return true;
}

async function readBoundedStream(res, maxBytes) {
  if (!res) return null;
  if (!res.body) {
    try {
      const blob = await res.blob();
      if (!blob || blob.size <= 0 || blob.size > maxBytes) return null;
      return new Response(blob, {
        status: res.status,
        statusText: res.statusText,
        headers: res.headers
      });
    } catch {
      return null;
    }
  }

  try {
    const reader = res.body.getReader();
    const chunks = [];
    let bytes = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > maxBytes) {
        await reader.cancel().catch(() => {});
        return null;
      }
      chunks.push(value);
    }
    if (bytes <= 0) return null;
    return new Response(new Blob(chunks), {
      status: res.status,
      statusText: res.statusText,
      headers: res.headers
    });
  } catch {
    return null;
  }
}

async function measureStoredResponseSize(res, maxBytes) {
  if (!res) return 0;
  if (!res.body) {
    try {
      const blob = await res.blob();
      return (blob && blob.size <= maxBytes) ? blob.size : maxBytes + 1;
    } catch {
      return 0;
    }
  }

  try {
    const reader = res.body.getReader();
    let bytes = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > maxBytes) {
        await reader.cancel().catch(() => {});
        return bytes;
      }
    }
    return bytes;
  } catch {
    return 0;
  }
}

async function safelyPutInCache(cacheName, req, networkRes) {
  if (!isBasicCacheable(req, networkRes)) return;

  const url = new URL(typeof req === 'string' ? req : req.url, self.location.origin);
  const isProtected = PROTECTED_ASSETS.has(url.pathname);
  const headerLen = networkRes.headers.get('content-length');
  const length = headerLen ? parseInt(headerLen, 10) : null;

  if (length === null) {
    if (!isProtected) return;
  } else if (isNaN(length) || length <= 0 || length > MAX_ENTRY_BYTES) {
    return;
  }

  const boundedRes = await readBoundedStream(networkRes, MAX_ENTRY_BYTES);
  if (!boundedRes) return;

  try {
    const cache = await caches.open(cacheName);
    await cache.put(req, boundedRes);
    await trimCache(cacheName, MAX_CACHE_ENTRIES, MAX_TOTAL_BYTES);
  } catch {}
}

async function trimCache(cacheName, maxEntries, maxTotalBytes) {
  try {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    if (keys.length === 0) return;

    let entries = [];
    let totalBytes = 0;

    for (const req of keys) {
      const url = new URL(req.url, self.location.origin);
      const isProtected = PROTECTED_ASSETS.has(url.pathname);
      const res = await cache.match(req);
      if (!res) continue;

      const size = await measureStoredResponseSize(res, MAX_ENTRY_BYTES);
      totalBytes += size;
      entries.push({ req, size, isProtected });
    }

    let i = 0;
    while ((entries.length > maxEntries || totalBytes > maxTotalBytes) && i < entries.length) {
      if (!entries[i].isProtected) {
        await cache.delete(entries[i].req);
        totalBytes -= entries[i].size;
        entries.splice(i, 1);
      } else {
        i++;
      }
    }
  } catch {}
}

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_ASSETS).catch(() => {}))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  if (req.method !== 'GET') return;
  if (url.origin !== self.location.origin) return;

  for (const prefix of EXCLUDED_PATH_PREFIXES) {
    if (url.pathname.startsWith(prefix)) return;
  }

  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((networkRes) => {
          if (
            networkRes &&
            networkRes.status === 200 &&
            (url.pathname === '/' || url.pathname === '/index.html')
          ) {
            event.waitUntil(safelyPutInCache(CACHE_NAME, '/index.html', networkRes.clone()));
          }
          return networkRes;
        })
        .catch(() => {
          return caches.match('/index.html');
        })
    );
    return;
  }

  if (url.pathname.endsWith('.js') || url.pathname.endsWith('.css')) {
    event.respondWith(
      fetch(req)
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            event.waitUntil(safelyPutInCache(CACHE_NAME, req, networkRes.clone()));
          }
          return networkRes;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((cachedRes) => {
      const fetchPromise = fetch(req)
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            event.waitUntil(safelyPutInCache(CACHE_NAME, req, networkRes.clone()));
          }
          return networkRes;
        })
        .catch(() => cachedRes);

      return cachedRes || fetchPromise;
    })
  );
});
