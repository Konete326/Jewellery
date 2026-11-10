import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      trim: true,
      default: 'Home'
    },
    recipientName: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    addressLine: {
      type: String,
      required: true,
      trim: true
    },
    area: {
      type: String,
      trim: true,
      default: ''
    },
    city: {
      type: String,
      trim: true,
      default: 'Karachi'
    },
    postalCode: {
      type: String,
      trim: true,
      default: ''
    },
    isDefault: {
      type: Boolean,
      default: false
    }
  },
  {
    _id: true,
    timestamps: true
  }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: 'Valued Patron'
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      default: ''
    },
    role: {
      type: String,
      enum: ['customer', 'staff', 'admin'],
      default: 'customer'
    },
    authProvider: {
      type: String,
      enum: ['google', 'local'],
      default: 'local'
    },
    avatar: {
      type: String,
      default: ''
    },
    googleId: {
      type: String,
      default: ''
    },
    lastLoginAt: {
      type: Date,
      default: Date.now
    },
    lastGoldDigestSentAt: {
      type: Date,
      default: null
    },
    isActive: {
      type: Boolean,
      default: true
    },
    wishlist: {
      type: [String],
      default: []
    },
    addresses: {
      type: [addressSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

export const User = mongoose.models.User || mongoose.model('User', userSchema);
