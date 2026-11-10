import mongoose from 'mongoose';
import { Gallery } from './gallery.model.js';
import { Product } from '../products/product.model.js';

export class GalleryRepository {
  async create(data) {
    return await Gallery.create(data);
  }

  async findAll(query = { isActive: true }) {
    return await Gallery.find(query).sort({ createdAt: -1 });
  }

  async findPaginated({ page = 1, limit = 9, query = { isActive: true } }) {
    const skip = (Math.max(1, Number(page)) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Gallery.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Gallery.countDocuments(query)
    ]);
    return { items, total };
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

  async addReview(id, { userName, userEmail, rating, comment }) {
    let item = await this.findById(id);
    if (!item && mongoose.Types.ObjectId.isValid(id)) {
      item = await Product.findById(id);
    }
    if (!item) {
      const err = new Error('Jewellery piece not found');
      err.statusCode = 404;
      throw err;
    }

    item.reviews.push({ userName, userEmail, rating, comment });
    item.reviewCount = item.reviews.length;
    const totalScore = item.reviews.reduce((acc, r) => acc + r.rating, 0);
    item.averageRating = Number((totalScore / item.reviewCount).toFixed(1));
    await item.save();
    return item;
  }

  async getRecentReviews(limit = 15) {
    const [galleryItems, productItems] = await Promise.all([
      Gallery.find({ 'reviews.0': { $exists: true } }).select('title imageUrl category reviews').lean(),
      Product.find({ 'reviews.0': { $exists: true } }).select('title images category reviews').lean()
    ]);
    const allReviews = [];
    for (const item of [...galleryItems, ...productItems]) {
      const img = item.imageUrl || (Array.isArray(item.images) && item.images[0]) || '/assets/products/choker-ruby-01.jpg';
      for (const rev of item.reviews || []) {
        allReviews.push({
          ...rev,
          masterpieceId: item._id,
          masterpieceTitle: item.title,
          masterpieceCategory: item.category,
          masterpieceImage: img
        });
      }
    }
    allReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return allReviews.slice(0, limit);
  }
}

export const galleryRepository = new GalleryRepository();
