import { inquiryService } from './inquiry.service.js';
import { sendSuccess } from '../../utils/apiResponse.js';

export const getInquiries = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = await inquiryService.listInquiries({ page, limit });
    return sendSuccess(res, 200, 'Inquiries retrieved successfully', result);
  } catch (error) {
    next(error);
  }
};

export const createInquiry = async (req, res, next) => {
  try {
    const inquiry = await inquiryService.submitInquiry(req.body);
    return sendSuccess(res, 201, 'Bespoke consultation inquiry submitted successfully', inquiry);
  } catch (error) {
    next(error);
  }
};
