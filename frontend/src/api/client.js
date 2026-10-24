import { API_BASE_URL } from './endpoints.js';

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
  } catch (error) {
    throw error;
  }
}
