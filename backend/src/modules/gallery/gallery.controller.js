import { galleryService } from './gallery.service.js';

export class GalleryController {
  async getAll(req, res, next) {
    try {
      const items = await galleryService.getAllItems();
      res.status(200).json({
        success: true,
        count: items.length,
        data: items
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const { title, description, imageUrl } = req.body;
      const file = req.file;

      const item = await galleryService.createItem({
        title,
        description,
        file,
        imageUrl
      });

      res.status(201).json({
        success: true,
        message: 'Gallery project published successfully',
        data: item
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteItem(req, res, next) {
    try {
      const { id } = req.params;
      await galleryService.deleteItem(id);

      res.status(200).json({
        success: true,
        message: 'Gallery item deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

export const galleryController = new GalleryController();
