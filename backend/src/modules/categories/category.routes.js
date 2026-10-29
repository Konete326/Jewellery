import { Router } from 'express';
import { categoryController } from './category.controller.js';

const router = Router();

router.get('/', categoryController.getAll);
router.get('/:id', categoryController.getById);
router.post('/', categoryController.create);
router.put('/:id', categoryController.update);
router.patch('/:id/toggle-status', categoryController.toggleStatus);
router.delete('/:id', categoryController.remove);

export default router;
