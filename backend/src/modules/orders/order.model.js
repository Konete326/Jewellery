import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: { type: String, default: '' },
  title: { type: String, required: true },
  category: { type: String, default: 'Fine Jewellery' },
  purity: { type: String, default: '22K' },
  size: { type: String, default: '' },
  netWeight: { type: Number, default: 0 },
  grossWeight: { type: Number, default: 0 },
  stoneWeight: { type: Number, default: 0 },
  stoneSizeMm: { type: Number, default: null },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
  imageUrl: { type: String, default: '' }
});

const collectionRecordSchema = new mongoose.Schema(
  {
    collectedAt: { type: Date, default: null },
    collectedBy: { type: String, default: '' },
    verifiedBy: { type: String, default: '' },
    notes: { type: String, default: '' }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    customer: {
      name: { type: String, required: true },
      email: { type: String, default: '' },
      phone: { type: String, required: true },
      shippingAddress: { type: String, default: '' },
      city: { type: String, default: 'Karachi' }
    },
    fulfillmentType: {
      type: String,
      enum: ['Delivery', 'Showroom Pickup'],
      default: 'Showroom Pickup'
    },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true, min: 0 },
    advancePaid: { type: Number, default: 0 },
    balanceDue: { type: Number, default: 0 },
    orderStatus: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Processing', 'Ready', 'Delivered', 'Cancelled'],
      default: 'Pending'
    },
    paymentStatus: {
      type: String,
      enum: ['Unpaid', 'Partial', 'Paid', 'Refunded'],
      default: 'Unpaid'
    },
    isAvailabilityVerified: { type: Boolean, default: false },
    goldRateLock: {
      isLocked: { type: Boolean, default: false },
      lockedRate: { type: Number, default: 0 },
      karat: { type: String, default: '22K' },
      lockedAt: { type: Date },
      snapshotRate: { type: Number, default: 0 },
      snapshotRatePerGram: { type: Number, default: 0 },
      snapshotKarat: { type: String, default: '22K' },
      snapshotAt: { type: Date, default: null },
      pureGoldValue: { type: Number, default: 0 },
      minAdvanceRequired: { type: Number, default: 0 }
    },
    paymentDetails: {
      method: { type: String, default: 'Bank Transfer' },
      transactionRef: { type: String, default: '' },
      bankName: { type: String, default: '' }
    },
    tracking: {
      courier: { type: String, default: '' },
      trackingNumber: { type: String, default: '' }
    },
    collectionRecord: {
      type: collectionRecordSchema,
      default: () => ({})
    },
    customerNote: { type: String, default: '' },
    internalNotes: { type: String, default: '' },
    notificationLog: [
      {
        event: { type: String, required: true },
        recipient: { type: String, default: '' },
        status: { type: String, enum: ['sent', 'failed', 'skipped'], default: 'sent' },
        reason: { type: String, default: '' },
        sentAt: { type: Date, default: Date.now },
        idempotencyKey: { type: String, required: true }
      }
    ]
  },
  {
    timestamps: true
  }
);

export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
