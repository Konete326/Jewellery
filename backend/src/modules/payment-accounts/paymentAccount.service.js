import { paymentAccountRepository } from './paymentAccount.repository.js';

export const paymentAccountService = {
  async getAll() {
    return paymentAccountRepository.findAll();
  },

  async getActive() {
    return paymentAccountRepository.findActive();
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
    }
    return paymentAccountRepository.update(id, data);
  },

  async delete(id) {
    return paymentAccountRepository.delete(id);
  }
};
