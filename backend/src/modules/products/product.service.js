import { productRepository } from './product.repository.js';

export class ProductService {
  constructor(repo = productRepository) {
    this.repo = repo;
  }

  async listProducts(filters = {}, pagination = { page: 1, limit: 20 }) {
    const query = {};
    if (filters.category) query.category = filters.category;
    if (filters.metal) query.metal = filters.metal;

    const page = Math.max(1, Number(pagination.page) || 1);
    const limit = Math.max(1, Number(pagination.limit) || 20);
    const skip = (page - 1) * limit;

    const { items, total } = await this.repo.findAll(query, { skip, limit });
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

  async getProductBySlug(slug) {
    return this.repo.findBySlug(slug);
  }

  async createProduct(data) {
    return this.repo.create(data);
  }
}

export const productService = new ProductService();
