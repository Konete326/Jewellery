import mongoose from 'mongoose';

const rateItemSchema = new mongoose.Schema(
  {
    tola: { type: Number, required: true },
    tenGram: { type: Number, required: true },
    gram: { type: Number, required: true },
    ounce: { type: Number, default: 0 }
  },
  { _id: false }
);

const rateSchema = new mongoose.Schema(
  {
    gold: {
      '24K': { type: rateItemSchema, required: true },
      '22K': { type: rateItemSchema, required: true },
      '21K': { type: rateItemSchema, required: true },
      '18K': { type: rateItemSchema, required: true }
    },
    silver: {
      '24K': { type: rateItemSchema, required: true },
      '22K': { type: rateItemSchema, required: true }
    },
    marketSource: {
      type: String,
      default: 'Karachi Sarafa Jewellers Association'
    },
    marketStatus: {
      type: String,
      default: 'Open'
    },
    isManualOverride: {
      type: Boolean,
      default: false
    },
    lastSyncedAt: {
      type: Date,
      default: Date.now
    },
    updatedBy: {
      type: String,
      default: 'System (gold.pk)'
    }
  },
  { timestamps: true }
);

const rateLogSchema = new mongoose.Schema(
  {
    gold24kTola: { type: Number, required: true },
    silver24kTola: { type: Number, required: true },
    source: { type: String, required: true },
    isManualOverride: { type: Boolean, default: false },
    updatedBy: { type: String, default: 'Admin' }
  },
  { timestamps: true }
);

export const Rate = mongoose.model('Rate', rateSchema);
export const RateLog = mongoose.model('RateLog', rateLogSchema);
