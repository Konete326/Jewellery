import { Router } from 'express';
import { paymentAccountController } from './paymentAccount.controller.js';
import { getBankLedger } from '../orders/payment.controller.js';
import { verifyAuth, requireAdmin } from '../../middlewares/auth.js';

const router = Router();

router.get('/active', paymentAccountController.getActive);
router.get('/:id/ledger', verifyAuth, requireAdmin, getBankLedger);
router.get('/', verifyAuth, requireAdmin, paymentAccountController.getAll);
router.post('/', verifyAuth, requireAdmin, paymentAccountController.create);
router.put('/:id', verifyAuth, requireAdmin, paymentAccountController.update);
router.delete('/:id', verifyAuth, requireAdmin, paymentAccountController.remove);

export default router;
