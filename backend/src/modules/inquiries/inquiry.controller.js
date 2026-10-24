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

export const updateInquiryStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await inquiryService.updateInquiryStatus(id, status);
    if (!updated) {
      const err = new Error('Inquiry not found');
      err.statusCode = 404;
      throw err;
    }
    return sendSuccess(res, 200, 'Inquiry status updated successfully', updated);
  } catch (error) {
    next(error);
  }
};

export const deleteInquiry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await inquiryService.deleteInquiry(id);
    if (!deleted) {
      const err = new Error('Inquiry not found');
      err.statusCode = 404;
      throw err;
    }
    return sendSuccess(res, 200, 'Inquiry deleted successfully', deleted);
  } catch (error) {
    next(error);
  }
};

