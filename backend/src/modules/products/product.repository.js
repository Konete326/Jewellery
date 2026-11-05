import { Product } from './product.model.js';

export class ProductRepository {
  async findAll(filter = {}, pagination = { skip: 0, limit: 20 }) {
    const items = await Product.find(filter)
      .skip(pagination.skip)
      .limit(pagination.limit)
      .sort({ createdAt: -1 })
      .populate('supplierId', 'name contactPerson phone city status')
      .lean();
    const total = await Product.countDocuments(filter);
    return { items, total };
  }

  async findById(id) {
    return Product.findById(id).populate('supplierId', 'name contactPerson phone city status').lean();
  }

  async findBySlug(slug) {
    return Product.findOne({ slug }).populate('supplierId', 'name contactPerson phone city status').lean();
  }

  async findBySku(sku, excludeId = null) {
    if (!sku) return null;
    const q = { sku: String(sku).trim().toUpperCase() };
    if (excludeId) q._id = { $ne: excludeId };
    return Product.findOne(q).lean();
  }

  async create(data) {
    const product = new Product(data);
    await product.save();
    return Product.findById(product._id).populate('supplierId', 'name contactPerson phone city status').lean();
  }

  async updateById(id, data) {
    return Product.findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .populate('supplierId', 'name contactPerson phone city status')
      .lean();
  }

  async deleteById(id) {
    return Product.findByIdAndDelete(id).lean();
  }
}

export const productRepository = new ProductRepository();
