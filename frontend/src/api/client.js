import { API_BASE_URL } from './endpoints.js';
import { loadingManager } from '../lib/loadingManager.js';

export async function apiClient(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = { ...options.headers };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  }

  const config = {
    ...options,
    headers
  };

  const isSilent = Boolean(options.silent);
  if (!isSilent) {
    loadingManager.startRequest(options.loadingMessage || '');
  }

  try {
    const response = await fetch(url, config);
    const result = await response.json().catch(() => ({
      success: false,
      message: 'Failed to parse JSON response'
    }));

    if (!response.ok) {
      const error = new Error(result.message || 'Network request failed');
      error.status = response.status;
      error.details = result.errors;
      throw error;
    }

    return result;
  } finally {
    if (!isSilent) {
      loadingManager.endRequest();
    }
  }
}
