import { categoryRepository } from './category.repository.js';
import { Gallery } from '../gallery/gallery.model.js';
import { uploadToCloudinary } from '../../config/cloudinary.js';
import { DEFAULT_JEWELLERY_CATEGORIES } from './category.constants.js';

export class CategoryService {
  async getAllCategories(filter = {}) {
    const totalCount = await categoryRepository.count({});
    if (totalCount === 0) {
      await categoryRepository.insertMany(DEFAULT_JEWELLERY_CATEGORIES);
    }
    const query = {};
    if (filter.isActive !== undefined) {
      query.isActive = filter.isActive === 'true' || filter.isActive === true;
    }
    const categories = await categoryRepository.findAll(query);
    const pieceCounts = await Gallery.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: { $toLower: '$category' }, count: { $sum: 1 } } }
    ]);
    const countMap = {};
    for (const item of pieceCounts) {
      if (item._id) countMap[item._id] = item.count;
    }
    return categories.map((cat) => ({
      ...cat,
      itemCount: countMap[cat.name.toLowerCase().trim()] || 0
    }));
  }

  async getCategoryById(id) {
    const category = await categoryRepository.findById(id);
    if (!category) {
      const error = new Error('Category not found');
      error.status = 404;
      throw error;
    }
    return category;
  }

  async createCategory(data, file) {
    if (!data.name || !data.name.trim()) {
      const error = new Error('Category name is required');
      error.status = 400;
      throw error;
    }
    const existing = await categoryRepository.findByName(data.name);
    if (existing) {
      const error = new Error('A category with this name already exists');
      error.status = 409;
      throw error;
    }
    let finalImageUrl = data.imageUrl || '';
    if (file && file.buffer) {
      const uploadRes = await uploadToCloudinary(file.buffer, 'khalil_categories');
      finalImageUrl = uploadRes.secure_url;
    }
    const slug = (data.slug || data.name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return await categoryRepository.create({
      ...data,
      name: data.name.trim(),
      slug,
      imageUrl: finalImageUrl,
      displayOrder: Number(data.displayOrder) || 0
    });
  }

  async updateCategory(id, data, file) {
    const existing = await categoryRepository.findById(id);
    if (!existing) {
      const error = new Error('Category not found');
      error.status = 404;
      throw error;
    }
    if (data.name && data.name.trim()) {
      const duplicate = await categoryRepository.findByName(data.name, id);
      if (duplicate) {
        const error = new Error('A category with this name already exists');
        error.status = 409;
        throw error;
      }
    }
    const updatePayload = { ...data };
    if (file && file.buffer) {
      const uploadRes = await uploadToCloudinary(file.buffer, 'khalil_categories');
      updatePayload.imageUrl = uploadRes.secure_url;
    }
    if (data.name) {
      updatePayload.name = data.name.trim();
      if (!data.slug) {
        updatePayload.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }
    }
    return await categoryRepository.update(id, updatePayload);
  }

  async toggleStatus(id) {
    const category = await categoryRepository.findById(id);
    if (!category) {
      const error = new Error('Category not found');
      error.status = 404;
      throw error;
    }
    return await categoryRepository.update(id, { isActive: !category.isActive });
  }

  async deleteCategory(id) {
    const category = await categoryRepository.findById(id);
    if (!category) {
      const error = new Error('Category not found');
      error.status = 404;
      throw error;
    }
    return await categoryRepository.delete(id);
  }
}

export const categoryService = new CategoryService();
