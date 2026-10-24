export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const ENDPOINTS = {
  HEALTH: '/health',
  PRODUCTS: '/products',
  PRODUCT_BY_SLUG: (slug) => `/products/${slug}`,
  INQUIRIES: '/inquiries',
  ORDERS: '/orders',
  ORDER_BY_NUMBER: (orderNumber) => `/orders/${orderNumber}`,
  GALLERY: '/gallery',
  GALLERY_BY_ID: (id) => `/gallery/${id}`
};

