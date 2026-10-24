import { apiClient } from './client.js';
import { ENDPOINTS } from './endpoints.js';

export const fetchProducts = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.category && params.category !== 'All') query.append('category', params.category);
  if (params.metal && params.metal !== 'All Metals') query.append('metal', params.metal);
  if (params.page) query.append('page', params.page);
  if (params.limit) query.append('limit', params.limit);

  const queryString = query.toString();
  const endpoint = queryString ? `${ENDPOINTS.PRODUCTS}?${queryString}` : ENDPOINTS.PRODUCTS;
  return apiClient(endpoint);
};

export const fetchProductBySlug = async (slug) => {
  return apiClient(ENDPOINTS.PRODUCT_BY_SLUG(slug));
};

export const createProduct = async (productData) => {
  return apiClient(ENDPOINTS.PRODUCTS, {
    method: 'POST',
    body: JSON.stringify(productData)
  });
};

export const updateProduct = async (id, productData) => {
  return apiClient(`${ENDPOINTS.PRODUCTS}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(productData)
  });
};

export const deleteProduct = async (id) => {
  return apiClient(`${ENDPOINTS.PRODUCTS}/${id}`, {
    method: 'DELETE'
  });
};

