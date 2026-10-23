import { orderRepository } from './order.repository.js';

export class OrderService {
  constructor(repo = orderRepository) {
    this.repo = repo;
  }

  async listOrders(pagination = { page: 1, limit: 20 }) {
    const page = Math.max(1, Number(pagination.page) || 1);
    const limit = Math.max(1, Number(pagination.limit) || 20);
    const skip = (page - 1) * limit;

    const { items, total } = await this.repo.findAll({}, { skip, limit });
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

  async getOrderByNumber(orderNumber) {
    return this.repo.findByOrderNumber(orderNumber);
  }

  async createOrder(data) {
    const orderNumber = `KS-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    return this.repo.create({ ...data, orderNumber });
  }
}

export const orderService = new OrderService();
