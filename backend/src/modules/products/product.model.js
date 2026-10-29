import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    sku: {
      type: String,
      trim: true,
      default: ''
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    purity: {
      type: String,
      enum: ['24K', '22K', '21K', '18K'],
      default: '22K'
    },
    grossWeight: {
      type: Number,
      default: 0,
      min: 0
    },
    netWeight: {
      type: Number,
      required: true,
      min: 0
    },
    makingCharges: {
      type: Number,
      default: 0,
      min: 0
    },
    wastagePercent: {
      type: Number,
      default: 0,
      min: 0
    },
    stoneCharges: {
      type: Number,
      default: 0,
      min: 0
    },
    price: {
      type: Number,
      default: 0,
      min: 0
    },
    stock: {
      type: Number,
      default: 1,
      min: 0
    },
    availability: {
      type: String,
      enum: ['In Stock', 'Made to Order', 'Out of Stock'],
      default: 'In Stock'
    },
    isPublished: {
      type: Boolean,
      default: true
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    images: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

export const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
