import { apiClient } from './client.js';
import { ENDPOINTS } from './endpoints.js';

export const createOrder = async (orderData) => {
  return apiClient(ENDPOINTS.ORDERS, {
    method: 'POST',
    body: JSON.stringify(orderData)
  });
};

export const fetchOrders = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.page) query.append('page', params.page);
  if (params.limit) query.append('limit', params.limit);
  if (params.orderStatus && params.orderStatus !== 'All') query.append('orderStatus', params.orderStatus);
  if (params.paymentStatus && params.paymentStatus !== 'All') query.append('paymentStatus', params.paymentStatus);
  if (params.search) query.append('search', params.search);

  const qs = query.toString();
  const url = qs ? `${ENDPOINTS.ORDERS}?${qs}` : ENDPOINTS.ORDERS;
  return apiClient(url);
};

export const fetchOrderById = async (id) => {
  return apiClient(ENDPOINTS.ORDER_BY_ID(id));
};

export const fetchOrderByNumber = async (orderNumber, phone = '') => {
  const cleanNumber = String(orderNumber || '').trim();
  const options = {};
  if (phone) {
    options.headers = { 'x-order-phone': String(phone).trim() };
  }
  return apiClient(ENDPOINTS.ORDER_BY_NUMBER(cleanNumber), options);
};

export const updateOrder = async (id, data) => {
  return apiClient(ENDPOINTS.ORDER_BY_ID(id), {
    method: 'PATCH',
    body: JSON.stringify(data)
  });
};

export const recordOrderCollection = async (id, collectionData = {}) => {
  return apiClient(ENDPOINTS.ORDER_COLLECT(id), {
    method: 'PATCH',
    body: JSON.stringify(collectionData)
  });
};

export const deleteOrder = async (id) => {
  return apiClient(ENDPOINTS.ORDER_BY_ID(id), {
    method: 'DELETE'
  });
};

export const recordOrderPayment = async (orderId, paymentData) => {
  return apiClient(ENDPOINTS.ORDER_PAYMENTS(orderId), {
    method: 'POST',
    body: JSON.stringify(paymentData)
  });
};

export const fetchOrderPayments = async (orderId) => {
  return apiClient(ENDPOINTS.ORDER_PAYMENTS(orderId));
};

export const approveOrderPayment = async (orderId, paymentId) => {
  return apiClient(ENDPOINTS.ORDER_PAYMENT_APPROVE(orderId, paymentId), {
    method: 'PATCH'
  });
};

export const rejectOrderPayment = async (orderId, paymentId, reason) => {
  return apiClient(ENDPOINTS.ORDER_PAYMENT_REJECT(orderId, paymentId), {
    method: 'PATCH',
    body: JSON.stringify({ reason })
  });
};

export const fetchOrderReceipts = async (orderId) => {
  return apiClient(ENDPOINTS.ORDER_RECEIPTS(orderId));
};
