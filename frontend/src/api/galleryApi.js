import { apiClient } from './client.js';
import { ENDPOINTS } from './endpoints.js';

export const galleryApi = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.page !== undefined) query.set('page', params.page);
    if (params.limit !== undefined) query.set('limit', params.limit);
    const qs = query.toString();
    return await apiClient(qs ? `${ENDPOINTS.GALLERY}?${qs}` : ENDPOINTS.GALLERY);
  },

  getById: async (id, options = {}) => {
    return await apiClient(ENDPOINTS.GALLERY_BY_ID(id), options);
  },

  create: async (formData) => {
    return await apiClient(ENDPOINTS.GALLERY, {
      method: 'POST',
      body: formData
    });
  },

  update: async (id, data) => {
    return await apiClient(ENDPOINTS.GALLERY_BY_ID(id), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
  },

  delete: async (id) => {
    return await apiClient(ENDPOINTS.GALLERY_BY_ID(id), {
      method: 'DELETE'
    });
  },

  addReview: async (id, reviewData) => {
    return await apiClient(ENDPOINTS.GALLERY_REVIEWS(id), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reviewData)
    });
  },

  getRecentReviews: async (limit = 15) => {
    return await apiClient(`${ENDPOINTS.GALLERY_RECENT_REVIEWS}?limit=${limit}`);
  },

  getAllReviews: async () => {
    return await apiClient(ENDPOINTS.GALLERY_ALL_REVIEWS);
  },

  updateReview: async (pieceId, reviewId, data) => {
    return await apiClient(ENDPOINTS.GALLERY_REVIEW_ITEM(pieceId, reviewId), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
  },

  deleteReview: async (pieceId, reviewId) => {
    return await apiClient(ENDPOINTS.GALLERY_REVIEW_ITEM(pieceId, reviewId), {
      method: 'DELETE'
    });
  }
};
