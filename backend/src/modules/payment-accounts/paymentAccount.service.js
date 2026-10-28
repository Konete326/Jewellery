import { paymentAccountRepository } from './paymentAccount.repository.js';

export const paymentAccountService = {
  async getAll() {
    return paymentAccountRepository.findAll();
  },

  async getActive() {
    return paymentAccountRepository.findActive();
  },

  async checkDuplicate({ iban, accountNumber }, excludeId = null) {
    if (iban && String(iban).trim()) {
      const match = await paymentAccountRepository.findByIban(iban, excludeId);
      if (match) return { field: 'iban', bankName: match.bankName };
    }
    if (accountNumber && String(accountNumber).trim()) {
      const match = await paymentAccountRepository.findByAccountNumber(accountNumber, excludeId);
      if (match) return { field: 'accountNumber', bankName: match.bankName };
    }
    return null;
  },

  async create(data) {
    if (data.isDefault) {
      await paymentAccountRepository.clearDefault();
    }
    return paymentAccountRepository.create(data);
  },

  async update(id, data) {
    if (data.isDefault) {
      await paymentAccountRepository.clearDefault();
    } else if (data.isActive === false) {
      const current = await paymentAccountRepository.findById(id);
      if (current?.isDefault) {
        const nextActive = await paymentAccountRepository.findNextActive(id);
        if (nextActive) {
          await paymentAccountRepository.update(nextActive._id, { isDefault: true });
        }
        data.isDefault = false;
      }
    }
    return paymentAccountRepository.update(id, data);
  },

  async delete(id) {
    const current = await paymentAccountRepository.findById(id);
    const result = await paymentAccountRepository.delete(id);
    if (current?.isDefault) {
      const nextActive = await paymentAccountRepository.findNextActive(id);
      if (nextActive) {
        await paymentAccountRepository.update(nextActive._id, { isDefault: true });
      }
    }
    return result;
  }
};
