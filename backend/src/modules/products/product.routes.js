import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  togglePublish,
  deleteProduct
} from './product.controller.js';
import { upload } from '../../middlewares/upload.js';
import { verifyAuth, requireAdmin } from '../../middlewares/auth.js';

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', verifyAuth, requireAdmin, upload.array('images', 6), createProduct);
router.put('/:id', verifyAuth, requireAdmin, upload.array('images', 6), updateProduct);
router.patch('/:id/toggle-publish', verifyAuth, requireAdmin, togglePublish);
router.delete('/:id', verifyAuth, requireAdmin, deleteProduct);

export default router;
