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
    const item = await Gallery.findById(id);
    if (item) return item;

    const prod = await Product.findById(id);
    if (prod) {
      return {
        _id: prod._id,
        id: prod._id,
        title: prod.title,
        description: prod.description,
        category: prod.category,
        imageUrl: prod.imageUrl || (Array.isArray(prod.images) && prod.images[0]),
        images: prod.images,
        purity: prod.purity || '22K',
        isProduct: true,
        isActive: prod.isPublished !== false
      };
    }
    return null;
  }

  async update(id, data) {
    return await Gallery.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return await Gallery.findByIdAndDelete(id);
  }

  async addReview(id, { userName, userEmail, rating, comment }) {
    const item = mongoose.Types.ObjectId.isValid(id) ? await Product.findById(id) : null;
    if (!item) {
      const err = new Error('Reviews are only available for purchasable shop products');
      err.statusCode = 400;
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
    const productItems = await Product.find({ isPublished: true, 'reviews.0': { $exists: true } })
      .select('title images category isPublished reviews')
      .lean();
    const allReviews = [];
    for (const item of productItems) {
      const img = item.imageUrl || (Array.isArray(item.images) && item.images[0]) || '/assets/products/choker-ruby-01.jpg';
      for (const rev of item.reviews || []) {
        allReviews.push({
          ...rev,
          masterpieceId: item._id,
          masterpieceTitle: item.title,
          masterpieceCategory: item.category,
          masterpieceImage: img,
          isArchived: false
        });
      }
    }
    allReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return allReviews.slice(0, limit);
  }
}

export const galleryRepository = new GalleryRepository();
