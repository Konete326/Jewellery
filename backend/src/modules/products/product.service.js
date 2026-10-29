import { productRepository } from './product.repository.js';
import { uploadToCloudinary } from '../../config/cloudinary.js';

export class ProductService {
  async listProducts(filters = {}, pagination = { page: 1, limit: 50 }) {
    const query = {};
    if (filters.category && filters.category !== 'all') {
      query.category = filters.category;
    }
    if (filters.isPublished !== undefined) {
      query.isPublished = filters.isPublished === 'true' || filters.isPublished === true;
    }
    if (filters.search && filters.search.trim()) {
      const q = filters.search.trim();
      query.$or = [
        { title: new RegExp(q, 'i') },
        { category: new RegExp(q, 'i') },
        { metal: new RegExp(q, 'i') }
      ];
    }

    const page = Math.max(1, Number(pagination.page) || 1);
    const limit = Math.max(1, Number(pagination.limit) || 50);
    const skip = (page - 1) * limit;

    const { items, total } = await productRepository.findAll(query, { skip, limit });
    return {
      items,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1
      }
    };
  }

  async getProductById(id) {
    return await productRepository.findById(id);
  }

  async getProductBySlug(slug) {
    return await productRepository.findBySlug(slug);
  }

  async createProduct(data, files = []) {
    let images = [];
    if (data.images) {
      images = Array.isArray(data.images) ? data.images : [data.images];
    }
    if (files && files.length > 0) {
      for (const file of files) {
        if (file.buffer) {
          const res = await uploadToCloudinary(file.buffer, 'khalil_products');
          images.push(res.secure_url);
        }
      }
    }
    const slugBase = data.slug || data.title || 'product';
    const slug = slugBase.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36);
    return await productRepository.create({
      ...data,
      slug,
      price: Number(data.price) || 0,
      stock: Number(data.stock) ?? 1,
      isPublished: data.isPublished !== false && data.isPublished !== 'false',
      images
    });
  }

  async updateProduct(id, data, files = []) {
    let images = [];
    if (data.images) {
      images = Array.isArray(data.images) ? data.images : [data.images];
    }
    if (files && files.length > 0) {
      for (const file of files) {
        if (file.buffer) {
          const res = await uploadToCloudinary(file.buffer, 'khalil_products');
          images.push(res.secure_url);
        }
      }
    }
    const updateData = { ...data };
    if (images.length > 0 || data.images !== undefined) {
      updateData.images = images;
    }
    if (data.price !== undefined) updateData.price = Number(data.price) || 0;
    if (data.stock !== undefined) updateData.stock = Number(data.stock) || 0;
    if (data.isPublished !== undefined) {
      updateData.isPublished = data.isPublished === true || data.isPublished === 'true';
    }
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
