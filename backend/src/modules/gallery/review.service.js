import { Gallery } from './gallery.model.js';

export class ReviewService {
  async getAllReviews() {
    const items = await Gallery.find({ 'reviews.0': { $exists: true } })
      .select('title imageUrl category reviews')
      .lean();

    const allReviews = [];
    for (const item of items) {
      for (const rev of item.reviews || []) {
        allReviews.push({
          ...rev,
          masterpieceId: item._id,
          masterpieceTitle: item.title,
          masterpieceImage: item.imageUrl,
          masterpieceCategory: item.category
        });
      }
    }

    allReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return allReviews;
  }

  async updateReview(pieceId, reviewId, { userName, userEmail, rating, comment }) {
    const item = await Gallery.findById(pieceId);
    if (!item) {
      const error = new Error('Gallery masterpiece not found');
      error.status = 404;
      throw error;
    }

    const review = item.reviews.id(reviewId);
    if (!review) {
      const error = new Error('Review not found');
      error.status = 404;
      throw error;
    }

    if (userName !== undefined) review.userName = userName;
    if (userEmail !== undefined) review.userEmail = userEmail;
    if (rating !== undefined) review.rating = Math.max(1, Math.min(5, Number(rating)));
    if (comment !== undefined) review.comment = comment;

    const totalScore = item.reviews.reduce((acc, r) => acc + r.rating, 0);
    item.averageRating = Number((totalScore / item.reviews.length).toFixed(1));

    await item.save();
    return {
      ...review.toObject(),
      masterpieceId: item._id,
      masterpieceTitle: item.title,
      masterpieceImage: item.imageUrl
    };
  }

  async deleteReview(pieceId, reviewId) {
    const item = await Gallery.findById(pieceId);
    if (!item) {
      const error = new Error('Gallery masterpiece not found');
      error.status = 404;
      throw error;
    }

    const initialLength = item.reviews.length;
    item.reviews = item.reviews.filter((r) => r._id.toString() !== reviewId.toString());

    if (item.reviews.length === initialLength) {
      const error = new Error('Review not found');
      error.status = 404;
      throw error;
    }

    item.reviewCount = item.reviews.length;
    if (item.reviewCount > 0) {
      const totalScore = item.reviews.reduce((acc, r) => acc + r.rating, 0);
      item.averageRating = Number((totalScore / item.reviewCount).toFixed(1));
    } else {
      item.averageRating = 0;
    }

    await item.save();
    return { success: true, message: 'Review deleted successfully' };
  }
}

export const reviewService = new ReviewService();
