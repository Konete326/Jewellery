import { apiClient } from './client.js';
import { ENDPOINTS } from './endpoints.js';

export const fetchCategories = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.isActive !== undefined) query.set('isActive', params.isActive);
  const qs = query.toString();
  return apiClient(qs ? `${ENDPOINTS.CATEGORIES}?${qs}` : ENDPOINTS.CATEGORIES);
};

export const fetchCategoryById = async (id) => {
  return apiClient(ENDPOINTS.CATEGORY_BY_ID(id));
};

export const createCategory = async (data) => {
  const isForm = data instanceof FormData;
  return apiClient(ENDPOINTS.CATEGORIES, {
    method: 'POST',
    body: isForm ? data : JSON.stringify(data)
  });
};

export const updateCategory = async (id, data) => {
  const isForm = data instanceof FormData;
  return apiClient(ENDPOINTS.CATEGORY_BY_ID(id), {
    method: 'PUT',
    body: isForm ? data : JSON.stringify(data)
  });
};

export const toggleCategoryStatus = async (id) => {
  return apiClient(ENDPOINTS.CATEGORY_TOGGLE_STATUS(id), {
    method: 'PATCH'
  });
};

export const deleteCategory = async (id) => {
  return apiClient(ENDPOINTS.CATEGORY_BY_ID(id), {
    method: 'DELETE'
  });
};
