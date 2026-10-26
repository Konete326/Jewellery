import { apiClient } from './client.js';
import { ENDPOINTS } from './endpoints.js';

export const ratesApi = {
  async getRates(options = {}) {
    return apiClient(ENDPOINTS.RATES, {
      method: 'GET',
      ...options
    });
  },

  async syncRates(updatedBy = 'Artisan Admin', options = {}) {
    return apiClient(ENDPOINTS.RATES_SYNC, {
      method: 'POST',
      body: JSON.stringify({ updatedBy }),
      loadingMessage: 'Synchronizing with Karachi Sarafa Market...',
      ...options
    });
  },

  async updateOverride(payload, options = {}) {
    return apiClient(ENDPOINTS.RATES_OVERRIDE, {
      method: 'PUT',
      body: JSON.stringify(payload),
      loadingMessage: 'Updating benchmark market rates...',
      ...options
    });
  },

  async getHistory(limit = 50, options = {}) {
    return apiClient(`${ENDPOINTS.RATES_HISTORY}?limit=${limit}`, {
      method: 'GET',
      ...options
    });
  },

  async deleteHistory(id, options = {}) {
    return apiClient(ENDPOINTS.RATES_HISTORY_ITEM(id), {
      method: 'DELETE',
      loadingMessage: 'Removing rate log...',
      ...options
    });
  },

  async getSchedulerStatus(options = {}) {
    return apiClient(ENDPOINTS.RATES_SCHEDULER, {
      method: 'GET',
      ...options
    });
  },

  async triggerScheduler(options = {}) {
    return apiClient(ENDPOINTS.RATES_SCHEDULER_TRIGGER, {
      method: 'POST',
      loadingMessage: 'Executing Sarafa auto-sync cron test...',
      ...options
    });
  }
};
