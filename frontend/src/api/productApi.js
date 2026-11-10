import { apiClient } from './client.js';
import { ENDPOINTS } from './endpoints.js';

export const fetchProducts = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.category && params.category !== 'all' && params.category !== 'All') query.set('category', params.category);
  if (params.supplierId && params.supplierId !== 'all' && params.supplierId !== 'All') query.set('supplierId', params.supplierId);
  if (params.availability && params.availability !== 'all' && params.availability !== 'All') query.set('availability', params.availability);
  if (params.isPublished !== undefined) query.set('isPublished', params.isPublished);
  if (params.search) query.set('search', params.search);
  if (params.page) query.set('page', params.page);
  if (params.limit) query.set('limit', params.limit);
  const qs = query.toString();
  return apiClient(qs ? `${ENDPOINTS.PRODUCTS}?${qs}` : ENDPOINTS.PRODUCTS);
};

export const fetchProductById = async (id, options = {}) => {
  return apiClient(ENDPOINTS.PRODUCT_BY_ID(id), options);
};

export const createProduct = async (data) => {
  const isForm = data instanceof FormData;
  return apiClient(ENDPOINTS.PRODUCTS, {
    method: 'POST',
    body: isForm ? data : JSON.stringify(data)
  });
};

export const updateProduct = async (id, data) => {
  const isForm = data instanceof FormData;
  return apiClient(ENDPOINTS.PRODUCT_BY_ID(id), {
    method: 'PUT',
    body: isForm ? data : JSON.stringify(data)
  });
};

export const toggleProductPublish = async (id) => {
  return apiClient(ENDPOINTS.PRODUCT_TOGGLE_PUBLISH(id), {
    method: 'PATCH'
  });
};

export const deleteProduct = async (id) => {
  return apiClient(ENDPOINTS.PRODUCT_BY_ID(id), {
    method: 'DELETE'
  });
};
