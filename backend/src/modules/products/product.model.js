import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    category: {
      type: String,
      required: true,
      enum: ['Rings', 'Necklaces', 'Bracelets', 'Earrings', 'Bespoke']
    },
    metal: {
      type: String,
      required: true,
      enum: ['24K Gold', '22K Gold', '18K White Gold', '18K Rose Gold', 'Platinum']
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    stock: {
      type: Number,
      default: 1,
      min: 0
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    description: {
      type: String,
      required: true
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
