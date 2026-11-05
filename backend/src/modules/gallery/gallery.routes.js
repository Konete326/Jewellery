import { Router } from 'express';
import { galleryController } from './gallery.controller.js';
import { reviewController } from './review.controller.js';
import { upload } from '../../middlewares/upload.js';
import { verifyAuth, requireAdmin } from '../../middlewares/auth.js';

const router = Router();

router.get('/', galleryController.getAll);
router.get('/reviews/all', verifyAuth, requireAdmin, reviewController.getAllReviews);
router.get('/reviews/recent', galleryController.getRecentReviews);
router.put('/:pieceId/reviews/:reviewId', verifyAuth, requireAdmin, reviewController.updateReview);
router.delete('/:pieceId/reviews/:reviewId', verifyAuth, requireAdmin, reviewController.deleteReview);
router.get('/:id', galleryController.getById);
router.post('/', verifyAuth, requireAdmin, upload.single('image'), galleryController.create);
router.put('/:id', verifyAuth, requireAdmin, galleryController.updateItem);
router.delete('/:id', verifyAuth, requireAdmin, galleryController.deleteItem);
router.post('/:id/reviews', galleryController.addReview);

export default router;
