import { Router } from 'express';
import { userController } from './user.controller.js';

const router = Router();

router.post('/google-auth', userController.googleAuth);
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/', userController.getAll);
router.patch('/:id/role', userController.updateRole);
router.delete('/:id', userController.delete);

export default router;
