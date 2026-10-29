import { uploadToCloudinary } from '../../config/cloudinary.js';

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
