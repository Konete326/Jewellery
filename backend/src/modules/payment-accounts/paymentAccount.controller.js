import { paymentAccountService } from './paymentAccount.service.js';

export const paymentAccountController = {
  async getAll(req, res, next) {
    try {
      const accounts = await paymentAccountService.getAll();
      return res.status(200).json({ success: true, data: accounts });
    } catch (err) {
      next(err);
    }
  },

  async getActive(req, res, next) {
    try {
      const accounts = await paymentAccountService.getActive();
      return res.status(200).json({ success: true, data: accounts });
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const { bankName, accountTitle, accountNumber, iban } = req.body;
      const cleanIban = iban ? String(iban).replace(/\s+/g, '').toUpperCase() : '';
      const cleanAcc = accountNumber ? String(accountNumber).trim() : '';

      if (!bankName?.trim() || !accountTitle?.trim() || (!cleanAcc && !cleanIban)) {
        return res.status(400).json({
          success: false,
          message: 'Bank name, account title, and either account number or IBAN are required.'
        });
      }

      if (cleanIban || cleanAcc) {
        const dup = await paymentAccountService.checkDuplicate({ iban: cleanIban, accountNumber: cleanAcc });
        if (dup) {
          const label = dup.field === 'iban' ? 'IBAN' : 'account number';
          return res.status(409).json({
            success: false,
            message: `This ${label} already belongs to ${dup.bankName}`
          });
        }
      }

      const payload = {
        ...req.body,
        bankName: bankName.trim(),
        accountTitle: accountTitle.trim(),
        accountNumber: cleanAcc,
        iban: cleanIban
      };

      const account = await paymentAccountService.create(payload);
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
      const payload = { ...req.body };
      if (payload.iban !== undefined) {
        payload.iban = payload.iban ? String(payload.iban).replace(/\s+/g, '').toUpperCase() : '';
      }
      if (payload.accountNumber !== undefined) {
        payload.accountNumber = payload.accountNumber ? String(payload.accountNumber).trim() : '';
      }
      if (payload.bankName) payload.bankName = payload.bankName.trim();
      if (payload.accountTitle) payload.accountTitle = payload.accountTitle.trim();

      if (payload.iban || payload.accountNumber) {
        const dup = await paymentAccountService.checkDuplicate(
          { iban: payload.iban, accountNumber: payload.accountNumber },
          req.params.id
        );
        if (dup) {
          const label = dup.field === 'iban' ? 'IBAN' : 'account number';
          return res.status(409).json({
            success: false,
            message: `This ${label} already belongs to ${dup.bankName}`
          });
        }
      }

      const account = await paymentAccountService.update(req.params.id, payload);
      if (!account) {
        return res.status(404).json({ success: false, message: 'Payment account not found.' });
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
        return res.status(404).json({ success: false, message: 'Payment account not found.' });
      }
      return res.status(200).json({ success: true, message: 'Payment account deleted successfully.' });
    } catch (err) {
      next(err);
    }
  }
};
