import { productRepository } from './product.repository.js';
import { rateService } from '../rates/rate.service.js';
import { calculateProductPricing } from './product.pricing.js';
import { processProductImages, generateProductSlug, validateProductSupplier, parseSupplierFilter } from './product.helper.js';

export class ProductService {
  async listProducts(filters = {}, pagination = { page: 1, limit: 50 }) {
    const query = {};
    if (filters.category && filters.category !== 'all') query.category = filters.category;
    if (filters.availability && filters.availability !== 'all') query.availability = filters.availability;
    if (filters.isPublished !== undefined) query.isPublished = filters.isPublished === 'true' || filters.isPublished === true;
    if (filters.search && filters.search.trim()) {
      const q = filters.search.trim();
      query.$or = [{ title: new RegExp(q, 'i') }, { sku: new RegExp(q, 'i') }, { category: new RegExp(q, 'i') }];
    }
    const supplierId = parseSupplierFilter(filters.supplierId);
    if (supplierId) query.supplierId = supplierId;
    const page = Math.max(1, Number(pagination.page) || 1), limit = Math.max(1, Number(pagination.limit) || 50);
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
    const [rates, product] = await Promise.all([rateService.getCurrentRates().catch(() => null), productRepository.findById(id)]);
    return product ? calculateProductPricing(product, rates) : null;
  }

  async getProductBySlug(slug) {
    const [rates, product] = await Promise.all([rateService.getCurrentRates().catch(() => null), productRepository.findBySlug(slug)]);
    return product ? calculateProductPricing(product, rates) : null;
  }

  async createProduct(data, files = []) {
    const images = await processProductImages(data.images, files);
    const sku = (data.sku || '').trim().toUpperCase();
    if (sku && (await productRepository.findBySku(sku))) {
      const err = new Error(`Product Code / SKU "${sku}" is already in use by another piece.`);
      err.status = 409;
      throw err;
    }
    const supplierId = await validateProductSupplier(data.supplierId, { isNew: true });
    const slug = generateProductSlug(data.title, sku);
    let price = Number(data.price) || 0;
    if (price <= 0 && Number(data.netWeight) > 0) {
      const rates = await rateService.getCurrentRates().catch(() => null);
      price = calculateProductPricing(data, rates).calculatedPrice || 0;
    }
    const created = await productRepository.create({
      title: data.title?.trim(), sku, slug, category: data.category?.trim(), purity: data.purity || '22K',
      grossWeight: Number(data.grossWeight) || 0, netWeight: Number(data.netWeight) || 0,
      makingCharges: Number(data.makingCharges) || 0, wastagePercent: Number(data.wastagePercent) || 0,
      stoneCharges: Number(data.stoneCharges) || 0, price,
      stock: data.stock !== undefined && !isNaN(Number(data.stock)) ? Number(data.stock) : 1,
      availability: data.availability || 'In Stock', isPublished: data.isPublished !== false && data.isPublished !== 'false',
      description: (data.description || '').trim(), images, supplierId
    });
    return calculateProductPricing(created);
  }

  async updateProduct(id, data, files = []) {
    const existing = await productRepository.findById(id);
    if (!existing) {
      const err = new Error('Product not found');
      err.status = 404;
      throw err;
    }
    const images = await processProductImages(data.images, files);
    const updateData = {};
    ['title', 'category', 'purity', 'availability', 'description'].forEach((f) => {
      if (data[f] !== undefined) updateData[f] = typeof data[f] === 'string' ? data[f].trim() : data[f];
    });
    if (data.sku !== undefined) {
      const trimmedSku = (data.sku || '').trim().toUpperCase();
      if (trimmedSku && (await productRepository.findBySku(trimmedSku, id))) {
        const err = new Error(`Product Code / SKU "${trimmedSku}" is already in use by another piece.`);
        err.status = 409;
        throw err;
      }
      updateData.sku = trimmedSku;
    }
    if (data.supplierId !== undefined) {
      updateData.supplierId = await validateProductSupplier(data.supplierId, { isNew: false, currentSupplierId: existing.supplierId });
    }
    ['grossWeight', 'netWeight', 'makingCharges', 'wastagePercent', 'stoneCharges', 'price', 'stock'].forEach((f) => {
      if (data[f] !== undefined) updateData[f] = Number(data[f]) || 0;
    });
    if (data.isPublished !== undefined) updateData.isPublished = data.isPublished === true || data.isPublished === 'true';
    if (images.length > 0 || data.images !== undefined) updateData.images = images;
    const updated = await productRepository.updateById(id, updateData);
    return updated ? calculateProductPricing(updated) : null;
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
