import mongoose from 'mongoose';

const storeProfileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: 'Khalil & Sons Jewellers',
      trim: true
    },
    tagline: {
      type: String,
      default: 'Master Goldsmithing & Bridal Jewellery Heirlooms',
      trim: true
    },
    email: {
      type: String,
      default: 'khalilandsonsjewellers@gmail.com',
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      default: '+92 333 3213613',
      trim: true
    },
    landline: {
      type: String,
      default: '+92 21 35670868',
      trim: true
    },
    whatsapp: {
      type: String,
      default: '+92 333 3213613',
      trim: true
    },
    whatsappClean: {
      type: String,
      default: '923333213613',
      trim: true
    },
    address: {
      type: String,
      default: 'Shop #2, Murshid Sunaar Tower, Dr. Daud Pota Road, Saddar, Karachi, 74400, Pakistan',
      trim: true
    },
    openingHours: {
      type: String,
      default: 'Mon–Sat: 2:00 PM – 9:00 PM (Fri: 3:30 PM – 9:30 PM) | Sun: Closed',
      trim: true
    },
    founder: {
      type: String,
      default: 'Mr. Khalil Ahmed',
      trim: true
    },
    establishedYear: {
      type: String,
      default: '1992',
      trim: true
    },
    assayStandard: {
      type: String,
      default: 'Certified 22K (916.6) & 24K (999.0) Hallmark Guaranteed',
      trim: true
    }
  },
  {
    timestamps: true
  }
);

export const StoreProfile =
  mongoose.models.StoreProfile || mongoose.model('StoreProfile', storeProfileSchema);

