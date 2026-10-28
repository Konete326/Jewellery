import { Router } from 'express';
import { paymentAccountController } from './paymentAccount.controller.js';

const router = Router();

router.get('/', paymentAccountController.getAll);
router.get('/active', paymentAccountController.getActive);
router.post('/', paymentAccountController.create);
router.put('/:id', paymentAccountController.update);
router.delete('/:id', paymentAccountController.remove);

export default router;
