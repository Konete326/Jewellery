import { Router } from 'express';
import { storeProfileController } from './storeProfile.controller.js';

const router = Router();

router.get('/', storeProfileController.get);
router.put('/', storeProfileController.update);

export default router;
