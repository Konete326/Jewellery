import { galleryRepository } from './gallery.repository.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../../config/cloudinary.js';

export class GalleryService {
  async createItem({ title, description, file, imageUrl }) {
    if (!title || !title.trim()) {
      throw new Error('Title is required');
    }

    let finalImageUrl = imageUrl;
    let publicId = '';

    if (file && file.buffer) {
      const uploadResult = await uploadToCloudinary(file.buffer, 'khalil_gallery');
      finalImageUrl = uploadResult.secure_url;
      publicId = uploadResult.public_id;
    }

    if (!finalImageUrl) {
      throw new Error('Image is required');
    }

    return await galleryRepository.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      imageUrl: finalImageUrl,
      publicId
    });
  }

  async getAllItems() {
    return await galleryRepository.findAll();
  }

  async deleteItem(id) {
    const item = await galleryRepository.findById(id);
    if (!item) {
      throw new Error('Gallery item not found');
    }

    if (item.publicId) {
      await deleteFromCloudinary(item.publicId);
    }

    return await galleryRepository.delete(id);
  }
}

export const galleryService = new GalleryService();
