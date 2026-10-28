import { PaymentAccount } from './paymentAccount.model.js';

export const paymentAccountRepository = {
  findAll: () => PaymentAccount.find().sort({ isDefault: -1, createdAt: -1 }),
  findActive: () => PaymentAccount.find({ isActive: true }).sort({ isDefault: -1, createdAt: -1 }),
  findById: (id) => PaymentAccount.findById(id),
  create: (data) => PaymentAccount.create(data),
  update: (id, data) => PaymentAccount.findByIdAndUpdate(id, data, { new: true }),
  delete: (id) => PaymentAccount.findByIdAndDelete(id),
  clearDefault: () => PaymentAccount.updateMany({}, { isDefault: false })
};
