import { Router } from 'express';
import { rateController } from './rate.controller.js';

const router = Router();

router.get('/', rateController.getRates);
router.post('/sync', rateController.syncRates);
router.put('/override', rateController.updateOverride);
router.get('/history', rateController.getHistory);
router.delete('/history/:id', rateController.deleteHistory);

export default router;
