import { Router } from 'express';
import { categoryController } from './category.controller.js';
import { upload } from '../../middlewares/upload.js';

const router = Router();

router.get('/', categoryController.getAll);
router.get('/:id', categoryController.getById);
router.post('/', upload.single('image'), categoryController.create);
router.put('/:id', upload.single('image'), categoryController.update);
router.patch('/:id/toggle-status', categoryController.toggleStatus);
router.delete('/:id', categoryController.remove);

export default router;
