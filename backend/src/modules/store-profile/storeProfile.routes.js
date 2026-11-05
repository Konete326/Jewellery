import { Router } from 'express';
import { storeProfileController } from './storeProfile.controller.js';
import { verifyAuth, requireAdmin } from '../../middlewares/auth.js';

const router = Router();

router.get('/', storeProfileController.get);
router.put('/', verifyAuth, requireAdmin, storeProfileController.update);

export default router;
