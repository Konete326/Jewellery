import { Router } from 'express';
import { userController } from './user.controller.js';
import { wishlistController } from './wishlist.controller.js';
import { addressController } from './address.controller.js';
import { createAddressSchema, updateAddressSchema, addressParamSchema } from './address.validation.js';
import { verifyAuth, requireAdmin } from '../../middlewares/auth.js';
import { authLimiter } from '../../middlewares/rateLimiter.js';
import { validateRequest } from '../../middlewares/validateRequest.js';

const router = Router();

router.post('/google-auth', authLimiter, userController.googleAuth);
router.post('/register', authLimiter, userController.register);
router.post('/login', authLimiter, userController.login);
router.get('/me', verifyAuth, userController.getMe);

router.get('/me/addresses', verifyAuth, addressController.getAddresses);
router.post('/me/addresses', verifyAuth, validateRequest(createAddressSchema), addressController.addAddress);
router.patch('/me/addresses/:addressId', verifyAuth, validateRequest(updateAddressSchema), addressController.updateAddress);
router.delete('/me/addresses/:addressId', verifyAuth, validateRequest(addressParamSchema), addressController.deleteAddress);

router.get('/', verifyAuth, requireAdmin, userController.getAll);
router.patch('/:id/role', verifyAuth, requireAdmin, userController.updateRole);
router.patch('/:id/status', verifyAuth, requireAdmin, userController.updateStatus);
router.get('/:id/activities', verifyAuth, requireAdmin, userController.getActivities);
router.delete('/:id', verifyAuth, requireAdmin, userController.delete);

router.get('/wishlist/:email', verifyAuth, wishlistController.getWishlist);
router.post('/wishlist/toggle', verifyAuth, wishlistController.toggleWishlist);
router.post('/wishlist/sync', verifyAuth, wishlistController.syncWishlist);

export default router;
