import { Router } from 'express';
import { galleryController } from './gallery.controller.js';
import { upload } from '../../middlewares/upload.js';

const router = Router();

router.get('/', galleryController.getAll);
router.post('/', upload.single('image'), galleryController.create);
router.delete('/:id', galleryController.deleteItem);

export default router;
