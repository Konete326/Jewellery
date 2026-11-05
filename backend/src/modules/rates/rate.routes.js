import { Router } from 'express';
import { rateController } from './rate.controller.js';
import { rateBroadcastController } from './rate.broadcast.controller.js';
import { verifyAuth, requireAdmin } from '../../middlewares/auth.js';

const router = Router();

router.get('/', rateController.getRates);
router.get('/history', rateController.getHistory);
router.post('/sync', verifyAuth, requireAdmin, rateController.syncRates);
router.put('/override', verifyAuth, requireAdmin, rateController.updateOverride);
router.delete('/history/:id', verifyAuth, requireAdmin, rateController.deleteHistory);
router.get('/scheduler', verifyAuth, requireAdmin, rateController.getScheduler);
router.post('/scheduler/trigger', verifyAuth, requireAdmin, rateController.triggerScheduler);
router.get('/broadcast/stats', verifyAuth, requireAdmin, rateBroadcastController.getStats);
router.post('/broadcast/send', verifyAuth, requireAdmin, rateBroadcastController.sendBroadcast);

export default router;
