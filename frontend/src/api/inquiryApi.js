import { apiClient } from './client.js';
import { ENDPOINTS } from './endpoints.js';

export const submitInquiry = async (inquiryData) => {
  return apiClient(ENDPOINTS.INQUIRIES, {
    method: 'POST',
    body: JSON.stringify(inquiryData)
  });
};

export const fetchInquiries = async () => {
  return apiClient(ENDPOINTS.INQUIRIES);
};

export const updateInquiryStatus = async (id, status) => {
  return apiClient(`${ENDPOINTS.INQUIRIES}/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  });
};

export const replyToInquiry = async (id, replyData) => {
  return apiClient(`${ENDPOINTS.INQUIRIES}/${id}/reply`, {
    method: 'POST',
    body: JSON.stringify(replyData)
  });
};

export const deleteInquiry = async (id) => {
  return apiClient(`${ENDPOINTS.INQUIRIES}/${id}`, {
    method: 'DELETE'
  });
};

