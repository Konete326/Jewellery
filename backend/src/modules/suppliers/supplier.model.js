import mongoose from 'mongoose';

export const SUPPLIED_CATEGORIES = [
  'Gold',
  'Silver',
  'Stones',
  'Diamonds',
  'Jewellery',
  'Other'
];

const supplierSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    contactPerson: {
      type: String,
      trim: true,
      default: ''
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    whatsapp: {
      type: String,
      trim: true,
      default: ''
    },
    city: {
      type: String,
      required: true,
      trim: true,
      default: 'Karachi'
    },
    address: {
      type: String,
      trim: true,
      default: ''
    },
    suppliedCategories: {
      type: [String],
      enum: SUPPLIED_CATEGORIES,
      default: ['Gold']
    },
    notes: {
      type: String,
      trim: true,
      default: ''
    },
    status: {
      type: String,
      enum: ['active', 'archived'],
      default: 'active'
    },
    normalizedName: {
      type: String,
      trim: true,
      lowercase: true
    },
    normalizedCity: {
      type: String,
      trim: true,
      lowercase: true,
      default: 'karachi'
    }
  },
  {
    timestamps: true
  }
);

supplierSchema.pre('validate', function () {
  if (this.name) {
    this.normalizedName = this.name.trim().toLowerCase();
  }
  if (this.city) {
    this.normalizedCity = this.city.trim().toLowerCase();
  } else {
    this.normalizedCity = 'karachi';
  }
});

supplierSchema.index(
  { normalizedName: 1, normalizedCity: 1 },
  { unique: true, partialFilterExpression: { status: 'active' } }
);
supplierSchema.index({ status: 1 });
supplierSchema.index({ suppliedCategories: 1 });

export const Supplier =
  mongoose.models.Supplier || mongoose.model('Supplier', supplierSchema);
