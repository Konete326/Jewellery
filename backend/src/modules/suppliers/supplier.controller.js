import { supplierService } from './supplier.service.js';
import { sendSuccess, sendError } from '../../utils/apiResponse.js';

export class SupplierController {
  async createSupplier(req, res, next) {
    try {
      const payload = req.validated?.body || req.body;
      const supplier = await supplierService.createSupplier(payload);
      return sendSuccess(res, 201, 'Supplier registered successfully', supplier);
    } catch (error) {
      if (error.statusCode) return sendError(res, error.statusCode, error.message);
      next(error);
    }
  }

  async getSuppliers(req, res, next) {
    try {
      const params = req.validated?.query || req.query;
      const data = await supplierService.getSuppliers(params);
      return sendSuccess(res, 200, 'Suppliers retrieved successfully', data);
    } catch (error) {
      if (error.statusCode) return sendError(res, error.statusCode, error.message);
      next(error);
    }
  }

  async getSupplierById(req, res, next) {
    try {
      const supplier = await supplierService.getSupplierById(req.params.id);
      return sendSuccess(res, 200, 'Supplier retrieved successfully', supplier);
    } catch (error) {
      if (error.statusCode) return sendError(res, error.statusCode, error.message);
      next(error);
    }
  }

  async updateSupplier(req, res, next) {
    try {
      const payload = req.validated?.body || req.body;
      const updated = await supplierService.updateSupplier(req.params.id, payload);
      return sendSuccess(res, 200, 'Supplier updated successfully', updated);
    } catch (error) {
      if (error.statusCode) return sendError(res, error.statusCode, error.message);
      next(error);
    }
  }

  async archiveSupplier(req, res, next) {
    try {
      const supplier = await supplierService.setSupplierStatus(req.params.id, 'archived');
      return sendSuccess(res, 200, 'Supplier archived successfully', supplier);
    } catch (error) {
      if (error.statusCode) return sendError(res, error.statusCode, error.message);
      next(error);
    }
  }

  async restoreSupplier(req, res, next) {
    try {
      const supplier = await supplierService.setSupplierStatus(req.params.id, 'active');
      return sendSuccess(res, 200, 'Supplier restored successfully', supplier);
    } catch (error) {
      if (error.statusCode) return sendError(res, error.statusCode, error.message);
      next(error);
    }
  }
}

export const supplierController = new SupplierController();
