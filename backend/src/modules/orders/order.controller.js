import { orderService } from './order.service.js';
import { sendSuccess } from '../../utils/apiResponse.js';

export const getOrders = async (req, res, next) => {
  try {
    const result = await orderService.listOrders(req.query);
    return sendSuccess(res, 200, 'Orders retrieved successfully', result);
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
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

export const getOrderByNumber = async (req, res, next) => {
  try {
    const order = await orderService.getOrderByNumber(req.params.orderNumber);
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

export const updateOrder = async (req, res, next) => {
  try {
    const updated = await orderService.updateOrder(req.params.id, req.body);
    if (!updated) {
      const err = new Error('Order not found');
      err.statusCode = 404;
      throw err;
    }
    return sendSuccess(res, 200, 'Order updated successfully', updated);
  } catch (error) {
    next(error);
  }
};

export const deleteOrder = async (req, res, next) => {
  try {
    const deleted = await orderService.deleteOrder(req.params.id);
    if (!deleted) {
      const err = new Error('Order not found');
      err.statusCode = 404;
      throw err;
    }
    return sendSuccess(res, 200, 'Order deleted successfully', deleted);
  } catch (error) {
    next(error);
  }
};
