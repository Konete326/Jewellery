import { apiClient } from './client.js';
import { ENDPOINTS } from './endpoints.js';

export const fetchSuppliers = async (params = {}, options = {}) => {
  const query = new URLSearchParams();
  if (params.page) query.set('page', params.page);
  if (params.limit) query.set('limit', params.limit);
  if (params.search && params.search.trim()) query.set('search', params.search.trim());
  if (params.category && params.category !== 'All' && params.category !== 'all') query.set('category', params.category);
  if (params.status) {
    const s = String(params.status).toLowerCase();
    if (['active', 'archived', 'all'].includes(s)) {
      query.set('status', s);
    }
  }
  if (params.sortBy) query.set('sortBy', params.sortBy);
  if (params.sortOrder) query.set('sortOrder', params.sortOrder);

  const qs = query.toString();
  const endpoint = qs ? `${ENDPOINTS.SUPPLIERS}?${qs}` : ENDPOINTS.SUPPLIERS;
  return apiClient(endpoint, { silent: options.silent });
};

export const fetchSupplierById = async (id) => {
  return apiClient(ENDPOINTS.SUPPLIER_BY_ID(id));
};

export const createSupplier = async (data) => {
  return apiClient(ENDPOINTS.SUPPLIERS, {
    method: 'POST',
    body: JSON.stringify(data)
  });
};

export const updateSupplier = async (id, data) => {
  return apiClient(ENDPOINTS.SUPPLIER_BY_ID(id), {
    method: 'PATCH',
    body: JSON.stringify(data)
  });
};

export const archiveSupplier = async (id) => {
  return apiClient(ENDPOINTS.SUPPLIER_ARCHIVE(id), {
    method: 'PATCH'
  });
};

export const restoreSupplier = async (id) => {
  return apiClient(ENDPOINTS.SUPPLIER_RESTORE(id), {
    method: 'PATCH'
  });
};

export const deleteSupplier = async (id) => {
  return apiClient(ENDPOINTS.SUPPLIER_BY_ID(id), {
    method: 'DELETE'
  });
};

