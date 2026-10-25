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
      default: '',
      trim: true
    },
    subject: {
      type: String,
      default: 'Atelier Inquiry',
      trim: true
    },
    jewelryType: {
      type: String,
      default: 'Other'
    },
    preferredMetal: {
      type: String,
      default: '22K Gold'
    },
    estimatedBudget: {
      type: String,
      default: 'Consultation'
    },
    message: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Contacted', 'Replied', 'In Design', 'Closed'],
      default: 'Pending'
    },
    replies: [
      {
        subject: { type: String, required: true },
        message: { type: String, required: true },
        sentAt: { type: Date, default: Date.now },
        sentBy: { type: String, default: 'Atelier Concierge' }
      }
    ]
  },
  {
    timestamps: true
  }
);

export const Inquiry = mongoose.models.Inquiry || mongoose.model('Inquiry', inquirySchema);
