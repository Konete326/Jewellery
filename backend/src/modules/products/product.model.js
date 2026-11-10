import mongoose from 'mongoose';

const productReviewSubSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true, trim: true },
    userEmail: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: '', trim: true }
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    sku: { type: String, trim: true, default: '' },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: { type: String, required: true, trim: true },
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
    },
    reviews: {
      type: [productReviewSubSchema],
      default: []
    },
    averageRating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0
    },
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supplier',
      default: null
    }
  },
  {
    timestamps: true
  }
);

productSchema.index({ supplierId: 1 });

export const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
