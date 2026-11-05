import { Router } from 'express';
import { supplierController } from './supplier.controller.js';
import {
  createSupplierSchema,
  updateSupplierSchema,
  supplierIdParamSchema,
  listSuppliersQuerySchema
} from './supplier.validation.js';
import { verifyAuth, requireAdmin } from '../../middlewares/auth.js';
import { validateRequest } from '../../middlewares/validateRequest.js';

const router = Router();

router.use(verifyAuth, requireAdmin);

router.post('/', validateRequest(createSupplierSchema), supplierController.createSupplier);
router.get('/', validateRequest(listSuppliersQuerySchema), supplierController.getSuppliers);
router.get('/:id', validateRequest(supplierIdParamSchema), supplierController.getSupplierById);
router.patch('/:id', validateRequest(updateSupplierSchema), supplierController.updateSupplier);
router.patch('/:id/archive', validateRequest(supplierIdParamSchema), supplierController.archiveSupplier);
router.patch('/:id/restore', validateRequest(supplierIdParamSchema), supplierController.restoreSupplier);
router.delete('/:id', validateRequest(supplierIdParamSchema), supplierController.archiveSupplier);

export default router;
