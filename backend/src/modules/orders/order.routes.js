import { Router } from 'express';
import { getOrders, getOrderByNumber, createOrder } from './order.controller.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { createOrderSchema } from './order.validation.js';

const router = Router();

router.get('/', getOrders);
router.get('/:orderNumber', getOrderByNumber);
router.post('/', validateRequest(createOrderSchema), createOrder);

export default router;
