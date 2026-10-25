import { apiClient } from './client.js';
import { ENDPOINTS } from './endpoints.js';

export const galleryApi = {
  getAll: async () => {
    return await apiClient(ENDPOINTS.GALLERY);
  },

  getById: async (id) => {
    return await apiClient(ENDPOINTS.GALLERY_BY_ID(id));
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
  }
};
