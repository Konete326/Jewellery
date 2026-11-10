import { Product } from '../products/product.model.js';

export class ReviewService {
  async getAllReviews() {
    const productItems = await Product.find({ 'reviews.0': { $exists: true } })
      .select('title images category reviews')
      .lean();

    const allReviews = [];
    for (const item of productItems) {
      const img = item.imageUrl || (Array.isArray(item.images) && item.images[0]) || '/assets/products/choker-ruby-01.jpg';
      for (const rev of item.reviews || []) {
        allReviews.push({
          ...rev,
          masterpieceId: item._id,
          masterpieceTitle: item.title,
          masterpieceImage: img,
          masterpieceCategory: item.category
        });
      }
    }

    allReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return allReviews;
  }

  async updateReview(pieceId, reviewId, { userName, userEmail, rating, comment }) {
    const item = await Product.findById(pieceId);
    if (!item) {
      const error = new Error('Shop product not found');
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
    const img = item.imageUrl || (Array.isArray(item.images) && item.images[0]) || '/assets/products/choker-ruby-01.jpg';
    return {
      ...review.toObject(),
      masterpieceId: item._id,
      masterpieceTitle: item.title,
      masterpieceImage: img
    };
  }

  async deleteReview(pieceId, reviewId) {
    const item = await Product.findById(pieceId);
    if (!item) {
      const error = new Error('Shop product not found');
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
