import { Order } from './order.model.js';

export class OrderRepository {
  async findAll(filter = {}, pagination = { skip: 0, limit: 50 }) {
    const items = await Order.find(filter)
      .skip(pagination.skip)
      .limit(pagination.limit)
      .sort({ createdAt: -1 })
      .lean();
    const total = await Order.countDocuments(filter);
    return { items, total };
  }

  async findById(id) {
    return Order.findById(id).lean();
  }

  async findByOrderNumber(orderNumber) {
    return Order.findOne({ orderNumber }).lean();
  }

  async create(data) {
    const order = new Order(data);
    return order.save();
  }

  async update(id, data) {
    return Order.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
  }

  async delete(id) {
    return Order.findByIdAndDelete(id).lean();
  }

  async count(filter = {}) {
    return Order.countDocuments(filter);
  }
}

export const orderRepository = new OrderRepository();
