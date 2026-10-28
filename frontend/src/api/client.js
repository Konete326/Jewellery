import { API_BASE_URL } from './endpoints.js';
import { loadingManager } from '../lib/loadingManager.js';
import { toast } from 'sonner';

const DEFAULT_TIMEOUT_MS = 12000;

export async function apiClient(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = { ...options.headers };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  }

  const timeoutMs = options.timeout !== undefined ? options.timeout : DEFAULT_TIMEOUT_MS;
  const controller = new AbortController();
  let timedOut = false;
  let timerId = null;

  if (timeoutMs && timeoutMs > 0) {
    timerId = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, timeoutMs);
  }

  if (options.signal) {
    if (options.signal.aborted) {
      controller.abort();
    } else {
      options.signal.addEventListener('abort', () => controller.abort(), { once: true });
    }
  }

  const config = {
    ...options,
    headers,
    signal: controller.signal
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
  } catch (error) {
    if (timedOut || error.name === 'AbortError') {
      if (timedOut) {
        toast.error('Network connection is slow. Please try again.', {
          description: 'Request exceeded response threshold.'
        });
        const timeoutError = new Error('Network connection is slow. Please try again.');
        timeoutError.isTimeout = true;
        throw timeoutError;
      }
    }
    throw error;
  } finally {
    if (timerId) {
      clearTimeout(timerId);
    }
    if (!isSilent) {
      loadingManager.endRequest();
    }
  }
}
