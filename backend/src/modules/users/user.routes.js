import { Router } from 'express';
import { userController } from './user.controller.js';
import { wishlistController } from './wishlist.controller.js';

const router = Router();

router.post('/google-auth', userController.googleAuth);
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/', userController.getAll);
router.patch('/:id/role', userController.updateRole);
router.patch('/:id/status', userController.updateStatus);
router.get('/:id/activities', userController.getActivities);
router.delete('/:id', userController.delete);

router.get('/wishlist/:email', wishlistController.getWishlist);
router.post('/wishlist/toggle', wishlistController.toggleWishlist);
router.post('/wishlist/sync', wishlistController.syncWishlist);

export default router;
