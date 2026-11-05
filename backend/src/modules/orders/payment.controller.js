import { paymentService } from './payment.service.js';
import { sendSuccess } from '../../utils/apiResponse.js';

export const recordPayment = async (req, res, next) => {
  try {
    const payment = await paymentService.recordPayment(req.params.id, req.body, req.user);
    return sendSuccess(res, 201, 'Payment submitted for verification', payment);
  } catch (error) {
    next(error);
  }
};

export const approvePayment = async (req, res, next) => {
  try {
    const result = await paymentService.approvePayment(req.params.id, req.params.paymentId, req.user);
    return sendSuccess(res, 200, 'Payment approved successfully', result);
  } catch (error) {
    next(error);
  }
};

export const rejectPayment = async (req, res, next) => {
  try {
    const result = await paymentService.rejectPayment(req.params.id, req.params.paymentId, req.body?.reason, req.user);
    return sendSuccess(res, 200, 'Payment rejected successfully', result);
  } catch (error) {
    next(error);
  }
};

export const getOrderPayments = async (req, res, next) => {
  try {
    const payments = await paymentService.getOrderPayments(req.params.id, req.user);
    return sendSuccess(res, 200, 'Order payment ledger retrieved successfully', payments);
  } catch (error) {
    next(error);
  }
};

export const getOrderReceipts = async (req, res, next) => {
  try {
    const receipts = await paymentService.getOrderReceipts(req.params.id, req.user);
    return sendSuccess(res, 200, 'Order receipts retrieved successfully', receipts);
  } catch (error) {
    next(error);
  }
};

export const getBankLedger = async (req, res, next) => {
  try {
    const ledger = await paymentService.getAccountLedger(req.params.id);
    return sendSuccess(res, 200, 'Bank account ledger retrieved successfully', ledger);
  } catch (error) {
    next(error);
  }
};
