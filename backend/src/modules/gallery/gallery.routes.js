import { Router } from 'express';
import { galleryController } from './gallery.controller.js';
import { reviewController } from './review.controller.js';
import { upload } from '../../middlewares/upload.js';

const router = Router();

router.get('/', galleryController.getAll);
router.get('/reviews/all', reviewController.getAllReviews);
router.get('/reviews/recent', galleryController.getRecentReviews);
router.put('/:pieceId/reviews/:reviewId', reviewController.updateReview);
router.delete('/:pieceId/reviews/:reviewId', reviewController.deleteReview);
router.get('/:id', galleryController.getById);
router.post('/', upload.single('image'), galleryController.create);
router.put('/:id', galleryController.updateItem);
router.delete('/:id', galleryController.deleteItem);
router.post('/:id/reviews', galleryController.addReview);

export default router;
