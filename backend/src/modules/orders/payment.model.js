import mongoose from 'mongoose';

export const normalizePaymentReference = (val) => {
  if (typeof val !== 'string') return '';
  return val.trim().toUpperCase();
};

const bankSnapshotSchema = new mongoose.Schema(
  {
    bankName: { type: String, required: true, trim: true },
    accountTitle: { type: String, trim: true, default: '' },
    accountNumber: { type: String, trim: true, default: '' },
    iban: { type: String, trim: true, default: '' },
    accountType: { type: String, trim: true, default: 'Bank Account' }
  },
  { _id: false }
);

const customerSnapshotSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, default: '' }
  },
  { _id: false }
);

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
      index: true
    },
    orderNumber: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    customer: {
      type: customerSnapshotSchema,
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 1
    },
    paymentType: {
      type: String,
      enum: ['Advance', 'Subsequent', 'Final Settlement'],
      default: 'Advance'
    },
    bankAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PaymentAccount',
      required: true,
      index: true
    },
    bankAccountSnapshot: {
      type: bankSnapshotSchema,
      required: true
    },
    paymentReference: {
      type: String,
      trim: true,
      default: '',
      set: normalizePaymentReference
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
      index: true
    },
    receiptNumber: {
      type: String,
      trim: true,
      default: '',
      index: true
    },
    notes: {
      type: String,
      trim: true,
      default: ''
    },
    approvedBy: { type: String, default: '' },
    approvedAt: { type: Date, default: null },
    rejectedBy: { type: String, default: '' },
    rejectedAt: { type: Date, default: null },
    rejectionReason: { type: String, default: '' }
  },
  {
    timestamps: true
  }
);

paymentSchema.index({ bankAccount: 1, status: 1 });
paymentSchema.index({ orderId: 1, createdAt: -1 });
paymentSchema.index(
  { orderId: 1, paymentReference: 1 },
  {
    unique: true,
    partialFilterExpression: {
      paymentReference: { $exists: true, $type: 'string', $gt: '' }
    }
  }
);

export const Payment = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);
