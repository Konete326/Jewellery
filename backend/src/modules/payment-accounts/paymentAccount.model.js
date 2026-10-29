import mongoose from 'mongoose';

const paymentAccountSchema = new mongoose.Schema(
  {
    bankName: {
      type: String,
      required: true,
      trim: true
    },
    accountTitle: {
      type: String,
      required: true,
      trim: true
    },
    accountNumber: {
      type: String,
      trim: true,
      default: ''
    },
    iban: {
      type: String,
      trim: true,
      default: ''
    },
    branchName: {
      type: String,
      trim: true,
      default: ''
    },
    accountType: {
      type: String,
      trim: true,
      default: 'Bank Account'
    },
    swiftCode: {
      type: String,
      trim: true,
      default: ''
    },
    instructions: {
      type: String,
      trim: true,
      default: ''
    },
    logoUrl: {
      type: String,
      trim: true,
      default: ''
    },
    isInstantSettlement: {
      type: Boolean,
      default: false
    },
    isDefault: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

export const PaymentAccount = mongoose.model('PaymentAccount', paymentAccountSchema);
