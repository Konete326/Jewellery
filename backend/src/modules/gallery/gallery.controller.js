import { galleryService } from './gallery.service.js';

export class GalleryController {
  async getAll(req, res, next) {
    try {
      const { page, limit, category } = req.query;
      const result = await galleryService.getAllItems({ page, limit }, { category });
      res.status(200).json({
        success: true,
        ...result
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const item = await galleryService.getItemById(id);
      res.status(200).json({
        success: true,
        data: item
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const { title, description, category, imageUrl } = req.body;
      const item = await galleryService.createItem({
        title,
        description,
        category,
        file: req.file,
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

  async updateItem(req, res, next) {
    try {
      const { id } = req.params;
      const { title, description, category, isActive } = req.body;
      const item = await galleryService.updateItem(id, { title, description, category, isActive });
      res.status(200).json({
        success: true,
        message: 'Gallery item updated successfully',
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

  async addReview(req, res, next) {
    try {
      const { id } = req.params;
      const { userName, userEmail, rating, comment, title, imageUrl } = req.body;
      const item = await galleryService.addReview(id, {
        userName,
        userEmail,
        rating: Number(rating) || 5,
        comment,
        title,
        imageUrl
      });
      res.status(201).json({
        success: true,
        message: 'Rating and review recorded successfully',
        data: item
      });
    } catch (error) {
      next(error);
    }
  }

  async getRecentReviews(req, res, next) {
    try {
      const limit = Number(req.query.limit) || 15;
      const reviews = await galleryService.getRecentReviews(limit);
      res.status(200).json({
        success: true,
        count: reviews.length,
        data: reviews
      });
    } catch (error) {
      next(error);
    }
  }
}

export const galleryController = new GalleryController();
