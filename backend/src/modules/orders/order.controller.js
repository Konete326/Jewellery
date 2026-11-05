import { orderService } from './order.service.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import { matchOrderPhone, formatTrackingResponse } from './order.privacy.js';
import { sanitizeCustomerOrder } from './order.sanitize.js';

const notFound = () => {
  const err = new Error('Order not found');
  err.statusCode = 404;
  return err;
};

export const getOrders = async (req, res, next) => {
  try {
    const data = await orderService.listOrders(req.query);
    return sendSuccess(res, 200, 'Orders retrieved successfully', data);
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    if (!order) throw notFound();
    const isAdmin = req.user?.role === 'admin';
    if (req.user && !isAdmin && req.user.email.toLowerCase() !== order.customer?.email?.toLowerCase()) {
      const err = new Error('Forbidden: You can only view your own orders');
      err.statusCode = 403;
      throw err;
    }
    return sendSuccess(res, 200, 'Order details retrieved successfully', isAdmin ? order : sanitizeCustomerOrder(order));
  } catch (error) {
    next(error);
  }
};

export const getOrderByNumber = async (req, res, next) => {
  try {
    const order = await orderService.getOrderByNumber(req.params.orderNumber);
    if (!order) throw notFound();
    if (req.user && req.user.role === 'admin') {
      return sendSuccess(res, 200, 'Order details retrieved successfully', order);
    }
    const phone = req.headers['x-order-phone'] || req.query.phone;
    if (!phone || !String(phone).trim()) {
      const err = new Error('Verification required: Registered contact phone number is required to track this order (via x-order-phone header or phone query)');
      err.statusCode = 400;
      throw err;
    }
    if (!matchOrderPhone(order.customer?.phone, phone)) {
      const err = new Error('Verification failed: Phone number does not match registered order contact');
      err.statusCode = 403;
      throw err;
    }
    return sendSuccess(res, 200, 'Tracking details retrieved successfully', formatTrackingResponse(order));
  } catch (error) {
    next(error);
  }
};

export const createOrder = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    if (req.user) {
      payload.customer = {
        ...payload.customer,
        email: payload.customer?.email || req.user.email,
        name: payload.customer?.name || req.user.name
      };
    }
    const newOrder = await orderService.createOrder(payload);
    return sendSuccess(res, 201, 'Order placed successfully', newOrder);
  } catch (error) {
    next(error);
  }
};

export const updateOrder = async (req, res, next) => {
  try {
    const updated = await orderService.updateOrder(req.params.id, req.body, req.user);
    if (!updated) throw notFound();
    return sendSuccess(res, 200, 'Order updated successfully', updated);
  } catch (error) {
    next(error);
  }
};

export const recordOrderCollection = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    if (!order) throw notFound();
    if (order.orderStatus === 'Delivered') {
      const err = new Error('Order has already been collected from the showroom');
      err.statusCode = 400;
      throw err;
    }
    if (order.orderStatus !== 'Ready') {
      const err = new Error("Order must be in 'Ready' status before showroom collection can be recorded");
      err.statusCode = 400;
      throw err;
    }
    const updated = await orderService.updateOrder(
      req.params.id,
      { orderStatus: 'Delivered', collectionRecord: req.body },
      req.user
    );
    return sendSuccess(res, 200, 'Showroom collection recorded successfully', updated);
  } catch (error) {
    next(error);
  }
};

export const deleteOrder = async (req, res, next) => {
  try {
    const deleted = await orderService.deleteOrder(req.params.id);
    if (!deleted) throw notFound();
    return sendSuccess(res, 200, 'Order deleted successfully', deleted);
  } catch (error) {
    next(error);
  }
};
