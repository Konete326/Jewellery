import mongoose from 'mongoose';
import { Gallery } from './gallery.model.js';

export class GalleryRepository {
  async create(data) {
    return await Gallery.create(data);
  }

  async findAll(query = { isActive: true }) {
    return await Gallery.find(query).sort({ createdAt: -1 });
  }

  async findById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return await Gallery.findOne({ $or: [{ _id: id }, { title: new RegExp(id, 'i') }] });
    }
    return await Gallery.findById(id);
  }

  async update(id, data) {
    return await Gallery.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return await Gallery.findByIdAndDelete(id);
  }

  async addReview(id, { userName, userEmail, rating, comment, title, imageUrl }) {
    let item = await this.findById(id);
    if (!item) {
      item = await Gallery.create({
        title: title || 'Haute Joaillerie Masterpiece',
        imageUrl: imageUrl || '/assets/products/choker-ruby-01.jpg',
        description: 'Living archive exhibition piece',
        reviews: []
      });
    }

    item.reviews.push({ userName, userEmail, rating, comment });
    item.reviewCount = item.reviews.length;
    const totalScore = item.reviews.reduce((acc, r) => acc + r.rating, 0);
    item.averageRating = Number((totalScore / item.reviewCount).toFixed(1));
    await item.save();
    return item;
  }

  async getRecentReviews(limit = 15) {
    const items = await Gallery.find({ 'reviews.0': { $exists: true } }).select('title imageUrl reviews').lean();
    const allReviews = [];
    for (const item of items) {
      for (const rev of item.reviews || []) {
        allReviews.push({
          ...rev,
          masterpieceId: item._id,
          masterpieceTitle: item.title,
          masterpieceImage: item.imageUrl
        });
      }
    }
    allReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return allReviews.slice(0, limit);
  }
}

export const galleryRepository = new GalleryRepository();
