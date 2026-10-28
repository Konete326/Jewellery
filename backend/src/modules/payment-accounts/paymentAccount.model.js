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
      required: true,
      trim: true
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
      enum: ['Bank Account', 'Digital Wallet', 'Raast ID', 'Wire Transfer'],
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
