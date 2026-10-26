import { Router } from 'express';
import { rateController } from './rate.controller.js';
import { rateBroadcastController } from './rate.broadcast.controller.js';

const router = Router();

router.get('/', rateController.getRates);
router.post('/sync', rateController.syncRates);
router.put('/override', rateController.updateOverride);
router.get('/history', rateController.getHistory);
router.delete('/history/:id', rateController.deleteHistory);
router.get('/scheduler', rateController.getScheduler);
router.post('/scheduler/trigger', rateController.triggerScheduler);
router.get('/broadcast/stats', rateBroadcastController.getStats);
router.post('/broadcast/send', rateBroadcastController.sendBroadcast);

export default router;
