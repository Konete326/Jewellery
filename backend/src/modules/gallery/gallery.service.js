import { galleryRepository } from './gallery.repository.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../../config/cloudinary.js';

export class GalleryService {
  async createItem({ title, description, file, imageUrl }) {
    if (!title || !title.trim()) {
      throw new Error('Title is required');
    }

    let finalImageUrl = imageUrl;
    let publicId = '';

    if (file && file.buffer) {
      const uploadResult = await uploadToCloudinary(file.buffer, 'khalil_gallery');
      finalImageUrl = uploadResult.secure_url;
      publicId = uploadResult.public_id;
    }

    if (!finalImageUrl) {
      throw new Error('Image is required');
    }

    return await galleryRepository.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      imageUrl: finalImageUrl,
      publicId
    });
  }

  async getAllItems(pagination = {}) {
    const { page, limit } = pagination;
    if (page !== undefined && limit !== undefined) {
      const pageNum = Math.max(1, Number(page));
      const limitNum = Math.max(1, Number(limit));
      const { items, total } = await galleryRepository.findPaginated({
        page: pageNum,
        limit: limitNum
      });
      return {
        count: items.length,
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum) || 1,
        hasMore: pageNum * limitNum < total,
        data: items
      };
    }
    const items = await galleryRepository.findAll();
    return {
      count: items.length,
      data: items
    };
  }

  async getItemById(id) {
    return await galleryRepository.findById(id);
  }

  async updateItem(id, { title, description, isActive }) {
    const item = await galleryRepository.findById(id);
    if (!item) {
      throw new Error('Gallery item not found');
    }

    const updateData = {};
    if (title !== undefined && title.trim()) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (isActive !== undefined) updateData.isActive = isActive;

    return await galleryRepository.update(id, updateData);
  }

  async deleteItem(id) {
    const item = await galleryRepository.findById(id);
    if (!item) {
      throw new Error('Gallery item not found');
    }

    if (item.publicId) {
      await deleteFromCloudinary(item.publicId);
    }

    return await galleryRepository.delete(id);
  }

  async addReview(id, reviewData) {
    return await galleryRepository.addReview(id, reviewData);
  }

  async getRecentReviews(limit) {
    return await galleryRepository.getRecentReviews(limit);
  }
}

export const galleryService = new GalleryService();
