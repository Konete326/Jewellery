import { Router } from 'express';
import { seoController } from './seo.controller.js';

const router = Router();

router.get('/sitemap.xml', seoController.getSitemap);
router.get('/robots.txt', seoController.getRobots);
router.get('/feed/google-shopping.xml', seoController.getMerchantFeed);
router.get('/google-merchant-feed.xml', seoController.getMerchantFeed);
router.get('/google:token.html', (req, res) => {
  const token = `google${req.params.token}.html`;
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(`google-site-verification: ${token}`);
});

export default router;
