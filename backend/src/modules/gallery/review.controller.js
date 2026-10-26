import { reviewService } from './review.service.js';

export class ReviewController {
  async getAllReviews(req, res, next) {
    try {
      const reviews = await reviewService.getAllReviews();
      res.status(200).json({
        success: true,
        count: reviews.length,
        data: reviews
      });
    } catch (error) {
      next(error);
    }
  }

  async updateReview(req, res, next) {
    try {
      const { pieceId, reviewId } = req.params;
      const { userName, userEmail, rating, comment } = req.body;
      const updated = await reviewService.updateReview(pieceId, reviewId, {
        userName,
        userEmail,
        rating,
        comment
      });
      res.status(200).json({
        success: true,
        message: 'Review updated successfully',
        data: updated
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteReview(req, res, next) {
    try {
      const { pieceId, reviewId } = req.params;
      const result = await reviewService.deleteReview(pieceId, reviewId);
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  }
}

export const reviewController = new ReviewController();
