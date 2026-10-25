import { Gallery } from '../gallery/gallery.model.js';
import { BASE_URL, optimizeCloudinaryUrl } from './seo.utils.js';

export async function generateSitemapXml() {
  const items = await Gallery.find({ isActive: true })
    .select('_id title category imageUrl updatedAt')
    .sort({ updatedAt: -1 })
    .lean();

  const staticRoutes = [
    { path: '', priority: '1.0', changefreq: 'daily' },
    { path: '/gallery', priority: '0.9', changefreq: 'daily' },
    { path: '/about', priority: '0.8', changefreq: 'weekly' },
    { path: '/contact', priority: '0.8', changefreq: 'monthly' }
  ];

  const now = new Date().toISOString().split('T')[0];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n';

  for (const route of staticRoutes) {
    xml += '  <url>\n';
    xml += `    <loc>${BASE_URL}${route.path}</loc>\n`;
    xml += `    <lastmod>${now}</lastmod>\n`;
    xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
    xml += `    <priority>${route.priority}</priority>\n`;
    xml += '  </url>\n';
  }

  for (const item of items) {
    const itemDate = item.updatedAt
      ? new Date(item.updatedAt).toISOString().split('T')[0]
      : now;
    const rawImg = item.imageUrl?.startsWith('http')
      ? item.imageUrl
      : `${BASE_URL}${item.imageUrl}`;
    const imgUrl = optimizeCloudinaryUrl(rawImg);
    const escapedTitle = (item.title || 'Fine Gold Jewellery')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    xml += '  <url>\n';
    xml += `    <loc>${BASE_URL}/gallery/${item._id}</loc>\n`;
    xml += `    <lastmod>${itemDate}</lastmod>\n`;
    xml += '    <changefreq>weekly</changefreq>\n';
    xml += '    <priority>0.7</priority>\n';
    if (imgUrl) {
      xml += '    <image:image>\n';
      xml += `      <image:loc>${imgUrl}</image:loc>\n`;
      xml += `      <image:title>${escapedTitle}</image:title>\n`;
      xml += '    </image:image>\n';
    }
    xml += '  </url>\n';
  }

  xml += '</urlset>';
  return xml;
}
