import { orderService } from './order.service.js';
import { sendSuccess } from '../../utils/apiResponse.js';

export const getOrders = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = await orderService.listOrders({ page, limit });
    return sendSuccess(res, 200, 'Orders retrieved successfully', result);
  } catch (error) {
    next(error);
  }
};

export const getOrderByNumber = async (req, res, next) => {
  try {
    const { orderNumber } = req.params;
    const order = await orderService.getOrderByNumber(orderNumber);
    if (!order) {
      const err = new Error('Order not found');
      err.statusCode = 404;
      throw err;
    }
    return sendSuccess(res, 200, 'Order details retrieved successfully', order);
  } catch (error) {
    next(error);
  }
};

export const createOrder = async (req, res, next) => {
  try {
    const newOrder = await orderService.createOrder(req.body);
    return sendSuccess(res, 201, 'Order placed successfully', newOrder);
  } catch (error) {
    next(error);
  }
};
