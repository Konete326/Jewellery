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

export const fetchOrderByNumber = async (orderNumber) => {
  return apiClient(ENDPOINTS.ORDER_BY_NUMBER(orderNumber));
};

export const updateOrder = async (id, data) => {
  return apiClient(ENDPOINTS.ORDER_BY_ID(id), {
    method: 'PATCH',
    body: JSON.stringify(data)
  });
};

export const deleteOrder = async (id) => {
  return apiClient(ENDPOINTS.ORDER_BY_ID(id), {
    method: 'DELETE'
  });
};
