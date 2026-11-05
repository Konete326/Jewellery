export const BASE_URL = 'https://khalilandsonsjewellers.com';

export const escapeXml = (str = '') =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

export const escapeCsv = (str = '') =>
  `"${String(str ?? '').replace(/"/g, '""').replace(/[\r\n]+/g, ' ').trim()}"`;

export const optimizeCloudinaryUrl = (url = '') => {
  if (!url || typeof url !== 'string') return url;
  if (url.includes('cloudinary.com') && url.includes('/upload/')) {
    if (!url.includes('f_auto') && !url.includes('q_auto')) {
      return url.replace('/upload/', '/upload/f_auto,q_auto/');
    }
  }
  return url;
};

export const resolveImageUrl = (raw = '') => {
  if (!raw || typeof raw !== 'string') return `${BASE_URL}/assets/products/choker-ruby-01.jpg`;
  const full = raw.startsWith('http') ? raw : `${BASE_URL}${raw.startsWith('/') ? '' : '/'}${raw}`;
  return optimizeCloudinaryUrl(full);
};
