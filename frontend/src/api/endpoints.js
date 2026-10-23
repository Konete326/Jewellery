export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const ENDPOINTS = {
  HEALTH: '/health',
  PRODUCTS: '/products',
  PRODUCT_BY_SLUG: (slug) => `/products/${slug}`,
  INQUIRIES: '/inquiries',
  ORDERS: '/orders',
  ORDER_BY_NUMBER: (orderNumber) => `/orders/${orderNumber}`
};
