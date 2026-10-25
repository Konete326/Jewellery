import { Router } from 'express';
import { seoController } from './seo.controller.js';

const router = Router();

router.get('/sitemap.xml', seoController.getSitemap);
router.get('/robots.txt', seoController.getRobots);
router.get('/:token(google[a-zA-Z0-9]+.html)', seoController.handleGoogleVerification);

export default router;
