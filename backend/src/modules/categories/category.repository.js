import { Category } from './category.model.js';

export class CategoryRepository {
  async findAll(query = {}, sort = { displayOrder: 1, createdAt: 1 }) {
    return await Category.find(query).sort(sort).lean();
  }

  async findById(id) {
    return await Category.findById(id);
  }

  async findByName(name, excludeId = null) {
    const filter = { name: new RegExp(`^${name.trim()}$`, 'i') };
    if (excludeId) {
      filter._id = { $ne: excludeId };
    }
    return await Category.findOne(filter);
  }

  async findBySlug(slug, excludeId = null) {
    const filter = { slug: slug.trim().toLowerCase() };
    if (excludeId) {
      filter._id = { $ne: excludeId };
    }
    return await Category.findOne(filter);
  }

  async create(data) {
    const category = new Category(data);
    return await category.save();
  }

  async update(id, data) {
    return await Category.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async delete(id) {
    return await Category.findByIdAndDelete(id);
  }

  async count(query = {}) {
    return await Category.countDocuments(query);
  }

  async insertMany(items) {
    return await Category.insertMany(items);
  }
}

export const categoryRepository = new CategoryRepository();
