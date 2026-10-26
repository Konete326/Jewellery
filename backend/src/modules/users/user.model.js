import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
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
      enum: ['customer', 'admin'],
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
    }
  },
  {
    timestamps: true
  }
);

export const User = mongoose.models.User || mongoose.model('User', userSchema);
