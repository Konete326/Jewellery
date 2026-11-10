import { productService } from './product.service.js';
import { sendSuccess, sendError } from '../../utils/apiResponse.js';
import { notifySearchEngines } from '../seo/indexingPing.service.js';

export const getProducts = async (req, res, next) => {
  try {
    const { category, isPublished, search, page, limit, supplierId, availability } = req.query;
    const result = await productService.listProducts(
      { category, isPublished, search, supplierId, availability },
      { page, limit }
    );
    return sendSuccess(res, 200, 'Products retrieved successfully', result);
  } catch (error) {
    if (error.statusCode || error.status) return sendError(res, error.statusCode || error.status, error.message);
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);
    if (!product) return sendError(res, 404, 'Product not found');
    return sendSuccess(res, 200, 'Product retrieved successfully', product);
  } catch (error) {
    if (error.statusCode || error.status) return sendError(res, error.statusCode || error.status, error.message);
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const files = req.files || (req.file ? [req.file] : []);
    const product = await productService.createProduct(req.body, files);
    notifySearchEngines({ id: product._id || product.id, type: 'URL_UPDATED' }).catch(() => null);
    return sendSuccess(res, 201, 'Product created successfully', product);
  } catch (error) {
    if (error.statusCode || error.status) return sendError(res, error.statusCode || error.status, error.message);
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const files = req.files || (req.file ? [req.file] : []);
    const updated = await productService.updateProduct(id, req.body, files);
    if (!updated) return sendError(res, 404, 'Product not found');
    notifySearchEngines({ id: updated._id || updated.id, type: 'URL_UPDATED' }).catch(() => null);
    return sendSuccess(res, 200, 'Product updated successfully', updated);
  } catch (error) {
    if (error.statusCode || error.status) return sendError(res, error.statusCode || error.status, error.message);
    next(error);
  }
};

export const togglePublish = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await productService.togglePublish(id);
    notifySearchEngines({ id, type: updated.isPublished ? 'URL_UPDATED' : 'URL_DELETED' }).catch(() => null);
    return sendSuccess(res, 200, `Product ${updated.isPublished ? 'published' : 'hidden'} successfully`, updated);
  } catch (error) {
    if (error.statusCode || error.status) return sendError(res, error.statusCode || error.status, error.message);
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await productService.deleteProduct(id);
    if (!deleted) return sendError(res, 404, 'Product not found');
    notifySearchEngines({ id, type: 'URL_DELETED' }).catch(() => null);
    return sendSuccess(res, 200, 'Product deleted successfully', deleted);
  } catch (error) {
    if (error.statusCode || error.status) return sendError(res, error.statusCode || error.status, error.message);
    next(error);
  }
};
