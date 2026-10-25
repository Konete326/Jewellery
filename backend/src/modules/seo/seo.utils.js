export const BASE_URL = 'https://khalilandsonsjewellers.com';

export const escapeXml = (str = '') =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

export const optimizeCloudinaryUrl = (url = '') => {
  if (!url || typeof url !== 'string') return url;
  if (url.includes('cloudinary.com') && url.includes('/upload/')) {
    if (!url.includes('f_auto') && !url.includes('q_auto')) {
      return url.replace('/upload/', '/upload/f_auto,q_auto/');
    }
  }
  return url;
};
