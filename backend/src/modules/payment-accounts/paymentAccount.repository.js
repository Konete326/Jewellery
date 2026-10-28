import { PaymentAccount } from './paymentAccount.model.js';

export const paymentAccountRepository = {
  findAll: () => PaymentAccount.find().sort({ isDefault: -1, createdAt: -1 }),
  findActive: () => PaymentAccount.find({ isActive: true }).sort({ isDefault: -1, createdAt: -1 }),
  findById: (id) => PaymentAccount.findById(id),
  findNextActive: (excludeId) =>
    PaymentAccount.findOne({ _id: { $ne: excludeId }, isActive: true }).sort({ createdAt: -1 }),
  findByIban: (iban, excludeId) =>
    PaymentAccount.findOne({ iban, ...(excludeId ? { _id: { $ne: excludeId } } : {}) }),
  findByAccountNumber: (accountNumber, excludeId) =>
    PaymentAccount.findOne({ accountNumber, ...(excludeId ? { _id: { $ne: excludeId } } : {}) }),
  create: (data) => PaymentAccount.create(data),
  update: (id, data) => PaymentAccount.findByIdAndUpdate(id, data, { new: true }),
  delete: (id) => PaymentAccount.findByIdAndDelete(id),
  clearDefault: () => PaymentAccount.updateMany({}, { isDefault: false })
};
