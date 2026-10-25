import { Gallery } from '../gallery/gallery.model.js';

const BASE_URL = 'https://khalilandsonsjewellers.com';

export class SeoController {
  async getSitemap(req, res, next) {
    try {
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
        const imgUrl = item.imageUrl?.startsWith('http')
          ? item.imageUrl
          : `${BASE_URL}${item.imageUrl}`;
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

      res.setHeader('Content-Type', 'application/xml');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      res.status(200).send(xml);
    } catch (error) {
      next(error);
    }
  }

  async getRobots(req, res) {
    const robots = [
      'User-agent: *',
      'Allow: /',
      'Disallow: /admin',
      'Disallow: /api/',
      '',
      `Sitemap: ${BASE_URL}/sitemap.xml`
    ].join('\n');

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.status(200).send(robots);
  }

  async handleGoogleVerification(req, res) {
    const { token } = req.params;
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(`google-site-verification: ${token}`);
  }
}

export const seoController = new SeoController();
