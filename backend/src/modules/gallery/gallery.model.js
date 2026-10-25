import mongoose from 'mongoose';

const reviewSubSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true, trim: true },
    userEmail: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: '', trim: true }
  },
  { timestamps: true }
);

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: '',
      trim: true
    },
    imageUrl: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      default: ''
    },
    order: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    },
    reviews: [reviewSubSchema],
    averageRating: {
      type: Number,
      default: 0
    },
    reviewCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

export const Gallery = mongoose.models.Gallery || mongoose.model('Gallery', gallerySchema);
