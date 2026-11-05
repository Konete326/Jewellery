import { addressService } from './address.service.js';
import { sendSuccess, sendError } from '../../utils/apiResponse.js';

export class AddressController {
  async getAddresses(req, res, next) {
    try {
      const addresses = await addressService.getAddresses(req.user._id);
      return sendSuccess(res, 200, 'Saved addresses retrieved', addresses);
    } catch (error) {
      if (error.statusCode) {
        return sendError(res, error.statusCode, error.message);
      }
      next(error);
    }
  }

  async addAddress(req, res, next) {
    try {
      const payload = req.validated?.body || req.body;
      const newAddress = await addressService.addAddress(req.user._id, payload);
      return sendSuccess(res, 201, 'Address saved successfully', newAddress);
    } catch (error) {
      if (error.statusCode) {
        return sendError(res, error.statusCode, error.message);
      }
      next(error);
    }
  }

  async updateAddress(req, res, next) {
    try {
      const { addressId } = req.params;
      const payload = req.validated?.body || req.body;
      const updated = await addressService.updateAddress(req.user._id, addressId, payload);
      return sendSuccess(res, 200, 'Address updated successfully', updated);
    } catch (error) {
      if (error.statusCode) {
        return sendError(res, error.statusCode, error.message);
      }
      next(error);
    }
  }

  async deleteAddress(req, res, next) {
    try {
      const { addressId } = req.params;
      await addressService.deleteAddress(req.user._id, addressId);
      return sendSuccess(res, 200, 'Address deleted successfully', { addressId });
    } catch (error) {
      if (error.statusCode) {
        return sendError(res, error.statusCode, error.message);
      }
      next(error);
    }
  }
}

export const addressController = new AddressController();
