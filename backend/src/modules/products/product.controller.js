import { productService } from './product.service.js';
import { sendSuccess } from '../../utils/apiResponse.js';

export const getProducts = async (req, res, next) => {
  try {
    const { category, metal, page, limit } = req.query;
    const result = await productService.listProducts({ category, metal }, { page, limit });
    return sendSuccess(res, 200, 'Products retrieved successfully', result);
  } catch (error) {
    next(error);
  }
};

export const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const product = await productService.getProductBySlug(slug);
    if (!product) {
      const err = new Error('Product not found');
      err.statusCode = 404;
      throw err;
    }
    return sendSuccess(res, 200, 'Product details retrieved successfully', product);
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const newProduct = await productService.createProduct(req.body);
    return sendSuccess(res, 201, 'Product created successfully', newProduct);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await productService.updateProduct(id, req.body);
    if (!updated) {
      const err = new Error('Product not found');
      err.statusCode = 404;
      throw err;
    }
    return sendSuccess(res, 200, 'Product updated successfully', updated);
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
      err.statusCode = 404;
      throw err;
    }
    return sendSuccess(res, 200, 'Product deleted successfully', deleted);
  } catch (error) {
    next(error);
  }
};

