import { apiClient } from './client.js';
import { ENDPOINTS } from './endpoints.js';

export const galleryApi = {
  getAll: async () => {
    return await apiClient(ENDPOINTS.GALLERY);
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
  }
};
