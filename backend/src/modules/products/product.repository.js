import { Product } from './product.model.js';

export class ProductRepository {
  async findAll(filter = {}, pagination = { skip: 0, limit: 20 }) {
    const items = await Product.find(filter)
      .skip(pagination.skip)
      .limit(pagination.limit)
      .sort({ createdAt: -1 })
      .lean();
    const total = await Product.countDocuments(filter);
    return { items, total };
  }

  async findById(id) {
    return Product.findById(id).lean();
  }

  async findBySlug(slug) {
    return Product.findOne({ slug }).lean();
  }

  async create(data) {
    const product = new Product(data);
    return product.save();
  }

  async updateById(id, data) {
    return Product.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
  }

  async deleteById(id) {
    return Product.findByIdAndDelete(id).lean();
  }
}

export const productRepository = new ProductRepository();
