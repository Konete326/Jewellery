import { orderRepository } from './order.repository.js';

export class OrderService {
  constructor(repo = orderRepository) {
    this.repo = repo;
  }

  async listOrders(query = {}) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Number(query.limit) || 50);
    const skip = (page - 1) * limit;

    const filter = {};
    if (query.orderStatus && query.orderStatus !== 'All') {
      filter.orderStatus = query.orderStatus;
    }
    if (query.paymentStatus && query.paymentStatus !== 'All') {
      filter.paymentStatus = query.paymentStatus;
    }
    if (query.search) {
      const regex = new RegExp(query.search.trim(), 'i');
      filter.$or = [
        { orderNumber: regex },
        { 'customer.name': regex },
        { 'customer.email': regex },
        { 'customer.phone': regex }
      ];
    }

    const { items, total } = await this.repo.findAll(filter, { skip, limit });
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

  async getOrderById(id) {
    return this.repo.findById(id);
  }

  async getOrderByNumber(orderNumber) {
    return this.repo.findByOrderNumber(orderNumber);
  }

  async createOrder(data) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = data.orderNumber || `KS-${Date.now().toString().slice(-6)}-${randomSuffix}`;
    const totalAmount = Number(data.totalAmount) || 0;
    const advancePaid = Number(data.advancePaid) || 0;
    const balanceDue = Math.max(0, totalAmount - advancePaid);

    return this.repo.create({
      ...data,
      orderNumber,
      totalAmount,
      advancePaid,
      balanceDue: data.balanceDue !== undefined ? Number(data.balanceDue) : balanceDue
    });
  }

  async updateOrder(id, data) {
    if (data.totalAmount !== undefined || data.advancePaid !== undefined) {
      const existing = await this.repo.findById(id);
      if (existing) {
        const totalAmount = data.totalAmount !== undefined ? Number(data.totalAmount) : existing.totalAmount;
        const advancePaid = data.advancePaid !== undefined ? Number(data.advancePaid) : existing.advancePaid;
        data.balanceDue = Math.max(0, totalAmount - advancePaid);
      }
    }
    return this.repo.update(id, data);
  }

  async deleteOrder(id) {
    return this.repo.delete(id);
  }
}

export const orderService = new OrderService();
