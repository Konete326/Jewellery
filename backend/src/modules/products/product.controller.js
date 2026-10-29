import { productService } from './product.service.js';
import { sendSuccess } from '../../utils/apiResponse.js';

export const getProducts = async (req, res, next) => {
  try {
    const { category, isPublished, search, page, limit } = req.query;
    const result = await productService.listProducts({ category, isPublished, search }, { page, limit });
    return sendSuccess(res, 200, 'Products retrieved successfully', result);
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);
    if (!product) {
      const err = new Error('Product not found');
      err.status = 404;
      throw err;
    }
    return sendSuccess(res, 200, 'Product retrieved successfully', product);
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const files = req.files || (req.file ? [req.file] : []);
    const product = await productService.createProduct(req.body, files);
    return sendSuccess(res, 201, 'Product created successfully', product);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const files = req.files || (req.file ? [req.file] : []);
    const updated = await productService.updateProduct(id, req.body, files);
    if (!updated) {
      const err = new Error('Product not found');
      err.status = 404;
      throw err;
    }
    return sendSuccess(res, 200, 'Product updated successfully', updated);
  } catch (error) {
    next(error);
  }
};

export const togglePublish = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await productService.togglePublish(id);
    return sendSuccess(res, 200, `Product ${updated.isPublished ? 'published' : 'hidden'} successfully`, updated);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await productService.deleteProduct(id);
    if (!deleted) {
      const err = new Error('Product not found');
      err.status = 404;
      throw err;
    }
    return sendSuccess(res, 200, 'Product deleted successfully', deleted);
  } catch (error) {
    next(error);
  }
};
