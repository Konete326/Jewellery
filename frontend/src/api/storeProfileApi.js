import { apiClient } from './client.js';

const STORAGE_KEY = 'khalil_store_profile';

export function getCachedStoreProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveCachedStoreProfile(profile) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    window.dispatchEvent(new CustomEvent('khalil_store_profile_change', { detail: profile }));
    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel('khalil_channel');
      channel.postMessage({ type: 'STORE_PROFILE_UPDATE', profile });
      channel.close();
    }
  } catch {}
}

export const storeProfileApi = {
  async getProfile() {
    try {
      const res = await apiClient('/store-profile', { silent: true });
      if (res?.data) {
        saveCachedStoreProfile(res.data);
      }
      return res;
    } catch (err) {
      const cached = getCachedStoreProfile();
      if (cached) {
        return { success: true, data: cached };
      }
      throw err;
    }
  },

  async updateProfile(data) {
    const res = await apiClient('/store-profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    if (res?.data) {
      saveCachedStoreProfile(res.data);
    }
    return res;
  }
};
