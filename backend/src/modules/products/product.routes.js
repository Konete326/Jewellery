import { Router } from 'express';
import { getProducts, getProductBySlug, createProduct, updateProduct, deleteProduct } from './product.controller.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { createProductSchema, queryProductSchema } from './product.validation.js';

const router = Router();

router.get('/', validateRequest(queryProductSchema), getProducts);
router.get('/:slug', getProductBySlug);
router.post('/', validateRequest(createProductSchema), createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;

