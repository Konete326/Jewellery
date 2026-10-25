export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const ENDPOINTS = {
  HEALTH: '/health',
  PRODUCTS: '/products',
  PRODUCT_BY_SLUG: (slug) => `/products/${slug}`,
  INQUIRIES: '/inquiries',
  ORDERS: '/orders',
  ORDER_BY_NUMBER: (orderNumber) => `/orders/${orderNumber}`,
  GALLERY: '/gallery',
  GALLERY_BY_ID: (id) => `/gallery/${id}`,
  GALLERY_REVIEWS: (id) => `/gallery/${id}/reviews`,
  GALLERY_RECENT_REVIEWS: '/gallery/reviews/recent',
  USERS: '/users',
  USERS_GOOGLE_AUTH: '/users/google-auth',
  USERS_REGISTER: '/users/register',
  USERS_LOGIN: '/users/login',
  USERS_ROLE: (id) => `/users/${id}/role`,
  USER_BY_ID: (id) => `/users/${id}`
};
