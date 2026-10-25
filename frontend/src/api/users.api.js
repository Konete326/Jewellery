import { apiClient } from './client.js';
import { ENDPOINTS } from './endpoints.js';

export const usersApi = {
  async googleAuth(payload) {
    return await apiClient(ENDPOINTS.USERS_GOOGLE_AUTH, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async register(payload) {
    return await apiClient(ENDPOINTS.USERS_REGISTER, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async login(payload) {
    return await apiClient(ENDPOINTS.USERS_LOGIN, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async getAll() {
    return await apiClient(ENDPOINTS.USERS, {
      method: 'GET'
    });
  },

  async updateRole(id, role) {
    return await apiClient(ENDPOINTS.USERS_ROLE(id), {
      method: 'PATCH',
      body: JSON.stringify({ role })
    });
  },

  async delete(id) {
    return await apiClient(ENDPOINTS.USER_BY_ID(id), {
      method: 'DELETE'
    });
  }
};
