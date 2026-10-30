import { Router } from 'express';
import {
  getOrders,
  getOrderById,
  getOrderByNumber,
  createOrder,
  updateOrder,
  deleteOrder
} from './order.controller.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { createOrderSchema } from './order.validation.js';

const router = Router();

router.get('/', getOrders);
router.get('/number/:orderNumber', getOrderByNumber);
router.get('/:id', getOrderById);
router.post('/', validateRequest(createOrderSchema), createOrder);
router.patch('/:id', updateOrder);
router.delete('/:id', deleteOrder);

export default router;
