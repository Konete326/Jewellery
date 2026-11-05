import { uploadToCloudinary } from '../../config/cloudinary.js';
import { Supplier } from '../suppliers/supplier.model.js';
import mongoose from 'mongoose';

export async function processProductImages(existingImagesInput, files = []) {
  let images = [];
  if (existingImagesInput) {
    images = Array.isArray(existingImagesInput) ? [...existingImagesInput] : [existingImagesInput];
  }
  if (files && files.length > 0) {
    for (const file of files) {
      if (file.buffer) {
        const res = await uploadToCloudinary(file.buffer, 'khalil_products');
        images.push(res.secure_url);
      }
    }
  }
  return images;
}

export function generateProductSlug(title, sku) {
  const base = sku || title || 'product';
  return base.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36);
}

export async function validateProductSupplier(supplierId, { isNew = false, currentSupplierId = null } = {}) {
  if (supplierId === null || supplierId === undefined || supplierId === '') {
    return null;
  }
  const cleanId = String(supplierId).trim();
  if (!cleanId) return null;
  if (!mongoose.Types.ObjectId.isValid(cleanId) || !/^[0-9a-fA-F]{24}$/.test(cleanId)) {
    const err = new Error('Invalid supplier ID format');
    err.status = 400;
    err.statusCode = 400;
    throw err;
  }
  const supplier = await Supplier.findById(cleanId).lean();
  if (!supplier) {
    const err = new Error('Supplier not found');
    err.status = 404;
    err.statusCode = 404;
    throw err;
  }
  if (supplier.status === 'archived') {
    const isUnchanged = currentSupplierId && String(currentSupplierId) === cleanId;
    if (isNew || !isUnchanged) {
      const err = new Error('Cannot assign archived supplier to product. Sourcing partner must be active.');
      err.status = 400;
      err.statusCode = 400;
      throw err;
    }
  }
  return cleanId;
}

export function parseSupplierFilter(supplierId) {
  if (supplierId === undefined || supplierId === null || supplierId === '') return null;
  const cleanId = String(supplierId).trim();
  if (!cleanId) return null;
  if (!mongoose.Types.ObjectId.isValid(cleanId) || !/^[0-9a-fA-F]{24}$/.test(cleanId)) {
    const err = new Error('Invalid supplier ID format');
    err.status = 400;
    err.statusCode = 400;
    throw err;
  }
  return cleanId;
}

