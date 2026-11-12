import { Gallery } from '../gallery/gallery.model.js';
import { Product } from '../products/product.model.js';
import { BASE_URL, escapeXml, resolveImageUrl } from './seo.utils.js';

export async function generateSitemapXml() {
  const [galleryItems, productItems] = await Promise.all([
    Gallery.find({ isActive: true })
      .select('_id title category imageUrl updatedAt')
      .sort({ updatedAt: -1 })
      .lean(),
    Product.find({ isPublished: true })
      .select('_id title category images updatedAt')
      .sort({ updatedAt: -1 })
      .lean()
  ]);

  const staticRoutes = [
    { path: '', priority: '1.0', changefreq: 'daily' },
    { path: '/shop', priority: '0.9', changefreq: 'daily' },
    { path: '/masterpieces', priority: '0.9', changefreq: 'daily' },
    { path: '/rates', priority: '0.8', changefreq: 'daily' },
    { path: '/reviews', priority: '0.8', changefreq: 'weekly' },
    { path: '/about', priority: '0.7', changefreq: 'monthly' },
    { path: '/contact', priority: '0.7', changefreq: 'monthly' },
    { path: '/track-order', priority: '0.6', changefreq: 'monthly' },
    { path: '/collections/Bridal-Sets', priority: '0.8', changefreq: 'weekly' },
    { path: '/collections/Rings', priority: '0.8', changefreq: 'weekly' },
    { path: '/collections/Bangles', priority: '0.8', changefreq: 'weekly' },
    { path: '/collections/gold-chains', priority: '0.8', changefreq: 'weekly' },
    { path: '/collections/gold-bracelets', priority: '0.8', changefreq: 'weekly' },
    { path: '/collections/gold-earrings', priority: '0.8', changefreq: 'weekly' },
    { path: '/collections/gold-necklaces', priority: '0.8', changefreq: 'weekly' },
    { path: '/collections/gold-coins-bars', priority: '0.8', changefreq: 'weekly' }
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

  const seenIds = new Set();

  const appendItem = (id, title, rawImages, updatedAt, prefix = 'product') => {
    const idStr = String(id);
    if (!idStr || seenIds.has(idStr)) return;
    seenIds.add(idStr);

    const itemDate = updatedAt ? new Date(updatedAt).toISOString().split('T')[0] : now;
    const safeTitle = escapeXml(title || 'Fine Gold Jewellery');
    const imageList = Array.isArray(rawImages) ? rawImages : (rawImages ? [rawImages] : []);

    xml += '  <url>\n';
    xml += `    <loc>${BASE_URL}/${prefix}/${idStr}</loc>\n`;
    xml += `    <lastmod>${itemDate}</lastmod>\n`;
    xml += '    <changefreq>weekly</changefreq>\n';
    xml += '    <priority>0.7</priority>\n';
    for (const rawImg of imageList) {
      const imgUrl = rawImg ? resolveImageUrl(rawImg) : '';
      if (imgUrl) {
        xml += '    <image:image>\n';
        xml += `      <image:loc>${escapeXml(imgUrl)}</image:loc>\n`;
        xml += `      <image:title>${safeTitle}</image:title>\n`;
        xml += '    </image:image>\n';
      }
    }
    xml += '  </url>\n';
  };

  for (const g of galleryItems) {
    appendItem(g._id, g.title, g.imageUrl, g.updatedAt, 'masterpieces');
  }

  for (const p of productItems) {
    appendItem(p._id, p.title, p.images, p.updatedAt, 'product');
  }

  xml += '</urlset>';
  return xml;
}