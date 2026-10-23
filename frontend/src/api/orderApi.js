import { apiClient } from './client.js';
import { ENDPOINTS } from './endpoints.js';

export const createOrder = async (orderData) => {
  return apiClient(ENDPOINTS.ORDERS, {
    method: 'POST',
    body: JSON.stringify(orderData)
  });
};

export const fetchOrderByNumber = async (orderNumber) => {
  return apiClient(ENDPOINTS.ORDER_BY_NUMBER(orderNumber));
};
