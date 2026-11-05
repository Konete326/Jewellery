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

  async getMe() {
    return await apiClient(ENDPOINTS.USERS_ME, {
      method: 'GET'
    });
  },

  async getAddresses(options = {}) {
    return await apiClient(ENDPOINTS.USERS_ADDRESSES, {
      method: 'GET',
      ...options
    });
  },

  async addAddress(payload) {
    return await apiClient(ENDPOINTS.USERS_ADDRESSES, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async updateAddress(addressId, payload) {
    return await apiClient(ENDPOINTS.USER_ADDRESS_BY_ID(addressId), {
      method: 'PATCH',
      body: JSON.stringify(payload)
    });
  },

  async deleteAddress(addressId) {
    return await apiClient(ENDPOINTS.USER_ADDRESS_BY_ID(addressId), {
      method: 'DELETE'
    });
  },

  async setDefaultAddress(addressId) {
    return await apiClient(ENDPOINTS.USER_ADDRESS_BY_ID(addressId), {
      method: 'PATCH',
      body: JSON.stringify({ isDefault: true })
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

  async updateStatus(id, isActive) {
    return await apiClient(ENDPOINTS.USERS_STATUS(id), {
      method: 'PATCH',
      body: JSON.stringify({ isActive })
    });
  },

  async getActivities(id) {
    return await apiClient(ENDPOINTS.USERS_ACTIVITIES(id), {
      method: 'GET'
    });
  },

  async delete(id) {
    return await apiClient(ENDPOINTS.USER_BY_ID(id), {
      method: 'DELETE'
    });
  },

  async getWishlist(email, options = {}) {
    return await apiClient(ENDPOINTS.USERS_WISHLIST(email), {
      method: 'GET',
      silent: true,
      ...options
    });
  },

  async toggleWishlist(email, pieceId, options = {}) {
    return await apiClient(ENDPOINTS.USERS_WISHLIST_TOGGLE, {
      method: 'POST',
      body: JSON.stringify({ email, pieceId }),
      silent: true,
      ...options
    });
  },

  async syncWishlist(email, pieceIds, options = {}) {
    return await apiClient(ENDPOINTS.USERS_WISHLIST_SYNC, {
      method: 'POST',
      body: JSON.stringify({ email, pieceIds }),
      silent: true,
      ...options
    });
  }
};
