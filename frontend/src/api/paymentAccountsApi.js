import { apiClient } from './client.js';
import { ENDPOINTS } from './endpoints.js';

export const fetchPaymentAccounts = async () => {
  return apiClient(ENDPOINTS.PAYMENT_ACCOUNTS);
};

export const fetchActivePaymentAccounts = async () => {
  return apiClient(ENDPOINTS.PAYMENT_ACCOUNTS_ACTIVE);
};

export const createPaymentAccount = async (data) => {
  return apiClient(ENDPOINTS.PAYMENT_ACCOUNTS, {
    method: 'POST',
    body: JSON.stringify(data)
  });
};

export const updatePaymentAccount = async (id, data) => {
  return apiClient(ENDPOINTS.PAYMENT_ACCOUNT_BY_ID(id), {
    method: 'PUT',
    body: JSON.stringify(data)
  });
};

export const deletePaymentAccount = async (id) => {
  return apiClient(ENDPOINTS.PAYMENT_ACCOUNT_BY_ID(id), {
    method: 'DELETE'
  });
};
