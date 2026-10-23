import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    jewelryType: {
      type: String,
      required: true,
      enum: ['Bridal Set', 'Custom Ring', 'Diamond Necklace', 'Bespoke Bracelet', 'Other']
    },
    preferredMetal: {
      type: String,
      required: true,
      enum: ['24K Yellow Gold', '22K Gold', '18K White Gold', '18K Rose Gold', 'Platinum']
    },
    estimatedBudget: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Contacted', 'In Design', 'Closed'],
      default: 'Pending'
    }
  },
  {
    timestamps: true
  }
);

export const Inquiry = mongoose.models.Inquiry || mongoose.model('Inquiry', inquirySchema);
