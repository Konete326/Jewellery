import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    imageUrl: {
      type: String,
      trim: true,
      default: ''
    },
    hallmark: {
      type: String,
      trim: true,
      default: 'AU · 916.6'
    },
    metalStandard: {
      type: String,
      trim: true,
      default: '22K Gold'
    },
    displayOrder: {
      type: Number,
      default: 0
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

export const Category = mongoose.model('Category', categorySchema);
