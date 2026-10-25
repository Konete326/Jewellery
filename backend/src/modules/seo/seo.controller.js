import { generateSitemapXml } from './sitemap.feed.js';
import { generateGoogleMerchantXml } from './merchant.feed.js';
import { generateLocalInventoryXml, generateGoogleBusinessCsv } from './gbp.feed.js';
import { BASE_URL } from './seo.utils.js';

export class SeoController {
  async getSitemap(req, res, next) {
    try {
      const xml = await generateSitemapXml();
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

  async getMerchantFeed(req, res, next) {
    try {
      const xml = await generateGoogleMerchantXml();
      res.setHeader('Content-Type', 'application/xml');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      res.status(200).send(xml);
    } catch (error) {
      next(error);
    }
  }

  async getLocalInventoryFeed(req, res, next) {
    try {
      const xml = await generateLocalInventoryXml();
      res.setHeader('Content-Type', 'application/xml');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      res.status(200).send(xml);
    } catch (error) {
      next(error);
    }
  }

  async getGoogleBusinessCsv(req, res, next) {
    try {
      const csv = await generateGoogleBusinessCsv();
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="gbp-products.csv"');
      res.status(200).send(csv);
    } catch (error) {
      next(error);
    }
  }

  async handleGoogleVerification(req, res) {
    const { token } = req.params;
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(`google-site-verification: ${token}`);
  }
}

export const seoController = new SeoController();
