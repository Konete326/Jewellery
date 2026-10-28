import { paymentAccountService } from './paymentAccount.service.js';

export const paymentAccountController = {
  async getAll(req, res, next) {
    try {
      const accounts = await paymentAccountService.getAll();
      return res.status(200).json({
        success: true,
        data: accounts
      });
    } catch (err) {
      next(err);
    }
  },

  async getActive(req, res, next) {
    try {
      const accounts = await paymentAccountService.getActive();
      return res.status(200).json({
        success: true,
        data: accounts
      });
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const { bankName, accountTitle, accountNumber } = req.body;
      if (!bankName || !accountTitle || !accountNumber) {
        return res.status(400).json({
          success: false,
          message: 'Bank name, account title, and account number are required.'
        });
      }
      const account = await paymentAccountService.create(req.body);
      return res.status(201).json({
        success: true,
        message: 'Payment account added successfully.',
        data: account
      });
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const account = await paymentAccountService.update(req.params.id, req.body);
      if (!account) {
        return res.status(404).json({
          success: false,
          message: 'Payment account not found.'
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Payment account updated successfully.',
        data: account
      });
    } catch (err) {
      next(err);
    }
  },

  async remove(req, res, next) {
    try {
      const account = await paymentAccountService.delete(req.params.id);
      if (!account) {
        return res.status(404).json({
          success: false,
          message: 'Payment account not found.'
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Payment account removed successfully.'
      });
    } catch (err) {
      next(err);
    }
  }
};
