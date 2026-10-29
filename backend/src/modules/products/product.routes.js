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

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', upload.array('images', 6), createProduct);
router.put('/:id', upload.array('images', 6), updateProduct);
router.patch('/:id/toggle-publish', togglePublish);
router.delete('/:id', deleteProduct);

export default router;
