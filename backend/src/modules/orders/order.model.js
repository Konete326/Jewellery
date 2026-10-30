import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    default: 'Fine Jewellery'
  },
  purity: {
    type: String,
    default: '22K'
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  imageUrl: {
    type: String,
    default: ''
  }
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true
    },
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
      default: 'Delivery'
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    advancePaid: {
      type: Number,
      default: 0
    },
    balanceDue: {
      type: Number,
      default: 0
    },
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
    isAvailabilityVerified: {
      type: Boolean,
      default: false
    },
    goldRateLock: {
      isLocked: { type: Boolean, default: false },
      lockedRate: { type: Number, default: 0 },
      karat: { type: String, default: '22K' },
      lockedAt: { type: Date }
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
    customerNote: {
      type: String,
      default: ''
    },
    internalNotes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
