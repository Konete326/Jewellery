import { productRepository } from './product.repository.js';
import { rateService } from '../rates/rate.service.js';
import { calculateProductPricing } from './product.pricing.js';
import { processProductImages, generateProductSlug } from './product.helper.js';

export class ProductService {
  async listProducts(filters = {}, pagination = { page: 1, limit: 50 }) {
    const query = {};
    if (filters.category && filters.category !== 'all') query.category = filters.category;
    if (filters.isPublished !== undefined) {
      query.isPublished = filters.isPublished === 'true' || filters.isPublished === true;
    }
    if (filters.search && filters.search.trim()) {
      const q = filters.search.trim();
      query.$or = [{ title: new RegExp(q, 'i') }, { sku: new RegExp(q, 'i') }, { category: new RegExp(q, 'i') }];
    }
    const page = Math.max(1, Number(pagination.page) || 1);
    const limit = Math.max(1, Number(pagination.limit) || 50);
    const skip = (page - 1) * limit;

    const [rates, { items, total }] = await Promise.all([
      rateService.getCurrentRates().catch(() => null),
      productRepository.findAll(query, { skip, limit })
    ]);
    return {
      items: items.map((item) => calculateProductPricing(item, rates)),
      currentRates: rates?.gold || null,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) || 1 }
    };
  }

  async getProductById(id) {
    const [rates, product] = await Promise.all([
      rateService.getCurrentRates().catch(() => null),
      productRepository.findById(id)
    ]);
    return product ? calculateProductPricing(product, rates) : null;
  }

  async getProductBySlug(slug) {
    const [rates, product] = await Promise.all([
      rateService.getCurrentRates().catch(() => null),
      productRepository.findBySlug(slug)
    ]);
    return product ? calculateProductPricing(product, rates) : null;
  }

  async createProduct(data, files = []) {
    const images = await processProductImages(data.images, files);
    const slug = generateProductSlug(data.title, data.sku);
    let price = Number(data.price) || 0;
    if (price <= 0 && Number(data.netWeight) > 0) {
      const rates = await rateService.getCurrentRates().catch(() => null);
      price = calculateProductPricing(data, rates).calculatedPrice || 0;
    }
    return await productRepository.create({
      title: data.title?.trim(),
      sku: (data.sku || '').trim().toUpperCase(),
      slug,
      category: data.category?.trim(),
      purity: data.purity || '22K',
      grossWeight: Number(data.grossWeight) || 0,
      netWeight: Number(data.netWeight) || 0,
      makingCharges: Number(data.makingCharges) || 0,
      wastagePercent: Number(data.wastagePercent) || 0,
      stoneCharges: Number(data.stoneCharges) || 0,
      price,
      stock: data.stock !== undefined && !isNaN(Number(data.stock)) ? Number(data.stock) : 1,
      availability: data.availability || 'In Stock',
      isPublished: data.isPublished !== false && data.isPublished !== 'false',
      description: (data.description || '').trim(),
      images
    });
  }

  async updateProduct(id, data, files = []) {
    const images = await processProductImages(data.images, files);
    const updateData = {};
    const stringFields = ['title', 'category', 'purity', 'availability', 'description'];
    stringFields.forEach((f) => { if (data[f] !== undefined) updateData[f] = typeof data[f] === 'string' ? data[f].trim() : data[f]; });
    if (data.sku !== undefined) updateData.sku = data.sku.trim().toUpperCase();
    const numFields = ['grossWeight', 'netWeight', 'makingCharges', 'wastagePercent', 'stoneCharges', 'price', 'stock'];
    numFields.forEach((f) => { if (data[f] !== undefined) updateData[f] = Number(data[f]) || 0; });
    if (data.isPublished !== undefined) updateData.isPublished = data.isPublished === true || data.isPublished === 'true';
    if (images.length > 0 || data.images !== undefined) updateData.images = images;
    return await productRepository.updateById(id, updateData);
  }

  async togglePublish(id) {
    const product = await productRepository.findById(id);
    if (!product) {
      const err = new Error('Product not found');
      err.status = 404;
      throw err;
    }
    return await productRepository.updateById(id, { isPublished: !product.isPublished });
  }

  async deleteProduct(id) {
    return await productRepository.deleteById(id);
  }
}

export const productService = new ProductService();
