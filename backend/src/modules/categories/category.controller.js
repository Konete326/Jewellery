import { categoryService } from './category.service.js';

export class CategoryController {
  async getAll(req, res, next) {
    try {
      const { isActive } = req.query;
      const categories = await categoryService.getAllCategories({ isActive });
      res.status(200).json({
        success: true,
        count: categories.length,
        data: categories
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const category = await categoryService.getCategoryById(id);
      res.status(200).json({
        success: true,
        data: category
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const category = await categoryService.createCategory(req.body);
      res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: category
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const category = await categoryService.updateCategory(id, req.body);
      res.status(200).json({
        success: true,
        message: 'Category updated successfully',
        data: category
      });
    } catch (error) {
      next(error);
    }
  }

  async toggleStatus(req, res, next) {
    try {
      const { id } = req.params;
      const category = await categoryService.toggleStatus(id);
      res.status(200).json({
        success: true,
        message: `Category ${category.isActive ? 'activated' : 'hidden'} successfully`,
        data: category
      });
    } catch (error) {
      next(error);
    }
  }

  async remove(req, res, next) {
    try {
      const { id } = req.params;
      await categoryService.deleteCategory(id);
      res.status(200).json({
        success: true,
        message: 'Category removed successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

export const categoryController = new CategoryController();
