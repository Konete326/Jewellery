import { v2 as cloudinary } from 'cloudinary';
import { ENV } from './env.js';

const cloudName = process.env.CLOUDINARY_CLOUD_NAME || ENV.CLOUDINARY_CLOUD_NAME || '';
const apiKey = process.env.CLOUDINARY_API_KEY || ENV.CLOUDINARY_API_KEY || '';
const apiSecret = process.env.CLOUDINARY_API_SECRET || ENV.CLOUDINARY_API_SECRET || '';

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret
});

export const uploadToCloudinary = (fileBuffer, folder = 'khalil_gallery') => {
  return new Promise((resolve, reject) => {
    if (!cloudName || !apiKey || !apiSecret) {
      return resolve({
        secure_url: '/assets/products/choker-ruby-01.jpg',
        public_id: `khalil_mock_${Date.now()}`
      });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [
          { width: 1200, height: 1200, crop: 'fill', gravity: 'auto', quality: 'auto', fetch_format: 'auto' }
        ]
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

export const deleteFromCloudinary = async (publicId) => {
  if (!publicId || !cloudName) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Failed to delete asset from Cloudinary:', error.message);
  }
};

export default cloudinary;
