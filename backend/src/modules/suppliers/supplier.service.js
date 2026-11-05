import { Supplier } from './supplier.model.js';

const escapeRegex = (str = '') => String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const conflictError = (name, city) => {
  const err = new Error(`Supplier with name "${name}" already exists in ${city}`);
  err.statusCode = 409;
  return err;
};

export class SupplierService {
  async createSupplier(data) {
    const normName = String(data.name || '').trim().toLowerCase();
    const normCity = String(data.city || 'Karachi').trim().toLowerCase();
    const existing = await Supplier.findOne({
      $or: [
        { normalizedName: normName, normalizedCity: normCity },
        { name: new RegExp(`^${escapeRegex(data.name.trim())}$`, 'i'), city: new RegExp(`^${escapeRegex((data.city || 'Karachi').trim())}$`, 'i') }
      ]
    });
    if (existing) throw conflictError(data.name, existing.city);
    try {
      return await Supplier.create({ ...data, normalizedName: normName, normalizedCity: normCity });
    } catch (error) {
      if (error.code === 11000) throw conflictError(data.name, data.city || 'Karachi');
      throw error;
    }
  }

  async getSuppliers(params = {}) {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(params.limit) || 20));
    const skip = (page - 1) * limit;
    const query = {};
    if (params.status && params.status !== 'all') query.status = params.status;
    if (params.category) query.suppliedCategories = new RegExp(`^${escapeRegex(params.category.trim())}$`, 'i');
    if (params.search && params.search.trim()) {
      const escaped = escapeRegex(params.search.trim());
      query.$or = [{ name: { $regex: escaped, $options: 'i' } }, { contactPerson: { $regex: escaped, $options: 'i' } }, { phone: { $regex: escaped, $options: 'i' } }, { city: { $regex: escaped, $options: 'i' } }];
    }
    const sortBy = ['createdAt', 'name', 'city'].includes(params.sortBy) ? params.sortBy : 'createdAt';
    const sortOrder = params.sortOrder === 'asc' ? 1 : -1;
    const [items, total] = await Promise.all([
      Supplier.find(query).sort({ [sortBy]: sortOrder }).skip(skip).limit(limit).lean(),
      Supplier.countDocuments(query)
    ]);
    const totalPages = Math.ceil(total / limit) || 1;
    return { items, pagination: { page, limit, total, totalPages, hasNextPage: page < totalPages, hasPrevPage: page > 1 } };
  }

  async getSupplierById(id) {
    const supplier = await Supplier.findById(id).lean();
    if (!supplier) {
      const err = new Error('Supplier not found');
      err.statusCode = 404;
      throw err;
    }
    return supplier;
  }

  async updateSupplier(id, updateData) {
    const supplier = await Supplier.findById(id);
    if (!supplier) {
      const err = new Error('Supplier not found');
      err.statusCode = 404;
      throw err;
    }
    const newName = updateData.name ? updateData.name.trim() : supplier.name;
    const newCity = updateData.city ? updateData.city.trim() : supplier.city;
    const normName = newName.toLowerCase();
    const normCity = newCity.toLowerCase();
    if (updateData.name || updateData.city) {
      const duplicate = await Supplier.findOne({
        _id: { $ne: id },
        $or: [
          { normalizedName: normName, normalizedCity: normCity },
          { name: new RegExp(`^${escapeRegex(newName)}$`, 'i'), city: new RegExp(`^${escapeRegex(newCity)}$`, 'i') }
        ]
      });
      if (duplicate) throw conflictError(newName, newCity);
    }
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined) supplier[key] = updateData[key];
    });
    supplier.normalizedName = normName;
    supplier.normalizedCity = normCity;
    try {
      await supplier.save();
      return supplier;
    } catch (error) {
      if (error.code === 11000) throw conflictError(newName, newCity);
      throw error;
    }
  }

  async setSupplierStatus(id, status) {
    const supplier = await Supplier.findById(id);
    if (!supplier) {
      const err = new Error('Supplier not found');
      err.statusCode = 404;
      throw err;
    }
    if (status === 'active') {
      const normName = (supplier.normalizedName || supplier.name.toLowerCase()).trim();
      const normCity = (supplier.normalizedCity || supplier.city.toLowerCase()).trim();
      const duplicate = await Supplier.findOne({
        _id: { $ne: id },
        status: 'active',
        $or: [
          { normalizedName: normName, normalizedCity: normCity },
          { name: new RegExp(`^${escapeRegex(supplier.name.trim())}$`, 'i'), city: new RegExp(`^${escapeRegex(supplier.city.trim())}$`, 'i') }
        ]
      });
      if (duplicate) throw conflictError(supplier.name, duplicate.city || supplier.city);
    }
    supplier.status = status;
    try {
      await supplier.save();
      return supplier;
    } catch (error) {
      if (error.code === 11000) throw conflictError(supplier.name, supplier.city);
      throw error;
    }
  }
}

export const supplierService = new SupplierService();
