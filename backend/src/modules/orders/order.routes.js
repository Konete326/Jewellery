import { Router } from 'express';
import {
  getOrders,
  getOrderById,
  getOrderByNumber,
  createOrder,
  updateOrder,
  recordOrderCollection,
  deleteOrder
} from './order.controller.js';
import {
  recordPayment,
  approvePayment,
  rejectPayment,
  getOrderPayments,
  getOrderReceipts
} from './payment.controller.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { createOrderSchema, updateOrderSchema } from './order.validation.js';
import { verifyAuth, requireAdmin, optionalAuth } from '../../middlewares/auth.js';
import { orderLimiter, trackingLimiter } from '../../middlewares/rateLimiter.js';

const router = Router();

router.get('/', verifyAuth, requireAdmin, getOrders);
router.get('/number/:orderNumber', trackingLimiter, optionalAuth, getOrderByNumber);
router.get('/:id', verifyAuth, getOrderById);
router.post('/', orderLimiter, optionalAuth, validateRequest(createOrderSchema), createOrder);
router.patch('/:id/collect', verifyAuth, requireAdmin, recordOrderCollection);
router.patch('/:id', verifyAuth, requireAdmin, validateRequest(updateOrderSchema), updateOrder);
router.delete('/:id', verifyAuth, requireAdmin, deleteOrder);

router.post('/:id/payments', orderLimiter, optionalAuth, recordPayment);
router.get('/:id/payments', verifyAuth, getOrderPayments);
router.patch('/:id/payments/:paymentId/approve', verifyAuth, requireAdmin, approvePayment);
router.patch('/:id/payments/:paymentId/reject', verifyAuth, requireAdmin, rejectPayment);
router.get('/:id/receipts', verifyAuth, getOrderReceipts);

export default router;
