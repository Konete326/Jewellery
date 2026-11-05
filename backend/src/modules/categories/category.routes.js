import { Router } from 'express';
import { categoryController } from './category.controller.js';
import { upload } from '../../middlewares/upload.js';
import { verifyAuth, requireAdmin } from '../../middlewares/auth.js';

const router = Router();

router.get('/', categoryController.getAll);
router.get('/:id', categoryController.getById);
router.post('/', verifyAuth, requireAdmin, upload.single('image'), categoryController.create);
router.put('/:id', verifyAuth, requireAdmin, upload.single('image'), categoryController.update);
router.patch('/:id/toggle-status', verifyAuth, requireAdmin, categoryController.toggleStatus);
router.delete('/:id', verifyAuth, requireAdmin, categoryController.remove);

export default router;
