import mongoose from 'mongoose';

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
    }
  },
  {
    timestamps: true
  }
);

export const Gallery = mongoose.models.Gallery || mongoose.model('Gallery', gallerySchema);
