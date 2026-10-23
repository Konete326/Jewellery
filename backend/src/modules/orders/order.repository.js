import { Order } from './order.model.js';

export class OrderRepository {
  async findAll(filter = {}, pagination = { skip: 0, limit: 20 }) {
    const items = await Order.find(filter)
      .skip(pagination.skip)
      .limit(pagination.limit)
      .sort({ createdAt: -1 })
      .lean();
    const total = await Order.countDocuments(filter);
    return { items, total };
  }

  async findByOrderNumber(orderNumber) {
    return Order.findOne({ orderNumber }).lean();
  }

  async create(data) {
    const order = new Order(data);
    return order.save();
  }
}

export const orderRepository = new OrderRepository();
