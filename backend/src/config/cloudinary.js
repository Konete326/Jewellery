import { v2 as cloudinary } from 'cloudinary';
import { ENV } from './env.js';

const cloudName = process.env.CLOUDINARY_CLOUD_NAME || ENV.CLOUDINARY_CLOUD_NAME || 'dsr2z1tyu';
const apiKey = process.env.CLOUDINARY_API_KEY || ENV.CLOUDINARY_API_KEY || '294349748696292';
const apiSecret = process.env.CLOUDINARY_API_SECRET || ENV.CLOUDINARY_API_SECRET || 'jX1MP864n72pQvUEJIVbC9_DNoc';

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret
});

export const uploadToCloudinary = (fileBuffer, folder = 'khalil_gallery') => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || ENV.CLOUDINARY_CLOUD_NAME || 'dsr2z1tyu',
    api_key: process.env.CLOUDINARY_API_KEY || ENV.CLOUDINARY_API_KEY || '294349748696292',
    api_secret: process.env.CLOUDINARY_API_SECRET || ENV.CLOUDINARY_API_SECRET || 'jX1MP864n72pQvUEJIVbC9_DNoc'
  });

  return new Promise((resolve, reject) => {
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
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Failed to delete asset from Cloudinary:', error);
  }
};

export default cloudinary;
