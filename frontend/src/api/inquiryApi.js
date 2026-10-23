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
