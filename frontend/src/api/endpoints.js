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
  GALLERY_ALL_REVIEWS: '/gallery/reviews/all',
  GALLERY_REVIEW_ITEM: (pieceId, reviewId) => `/gallery/${pieceId}/reviews/${reviewId}`,
  USERS: '/users',
  USERS_GOOGLE_AUTH: '/users/google-auth',
  USERS_REGISTER: '/users/register',
  USERS_LOGIN: '/users/login',
  USERS_ROLE: (id) => `/users/${id}/role`,
  USERS_STATUS: (id) => `/users/${id}/status`,
  USERS_ACTIVITIES: (id) => `/users/${id}/activities`,
  USER_BY_ID: (id) => `/users/${id}`,
  USERS_WISHLIST: (email) => `/users/wishlist/${encodeURIComponent(email)}`,
  USERS_WISHLIST_TOGGLE: '/users/wishlist/toggle',
  USERS_WISHLIST_SYNC: '/users/wishlist/sync'
};
