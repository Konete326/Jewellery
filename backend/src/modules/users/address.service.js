import { User } from './user.model.js';

const userLocks = new Map();
const withUserLock = async (userId, fn) => {
  const key = String(userId);
  const prev = userLocks.get(key) || Promise.resolve();
  let release;
  const gate = new Promise((res) => { release = res; });
  userLocks.set(key, gate);
  try {
    await prev.catch(() => {});
    return await fn();
  } finally {
    release();
    if (userLocks.get(key) === gate) userLocks.delete(key);
  }
};

const assertUserAndAddress = (user, addressId) => {
  if (!user) {
    const err = new Error('User account not found');
    err.statusCode = 404;
    throw err;
  }
  const existing = (user.addresses || []).find((a) => String(a._id) === String(addressId));
  if (!existing) {
    const err = new Error('Saved address not found');
    err.statusCode = 404;
    throw err;
  }
  return existing;
};

export class AddressService {
  async getAddresses(userId) {
    const user = await User.findById(userId).select('addresses').lean();
    if (!user) {
      const err = new Error('User account not found');
      err.statusCode = 404;
      throw err;
    }
    return [...(user.addresses || [])].sort((a, b) => {
      if (a.isDefault === b.isDefault) return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      return a.isDefault ? -1 : 1;
    });
  }

  async addAddress(userId, addressData) {
    return withUserLock(userId, async () => {
      const user = await User.findById(userId);
      if (!user) {
        const err = new Error('User account not found');
        err.statusCode = 404;
        throw err;
      }
      if ((user.addresses || []).length >= 10) {
        const err = new Error('Maximum 10 saved addresses allowed per customer');
        err.statusCode = 400;
        throw err;
      }
      if (addressData.isDefault === true) {
        await User.updateOne({ _id: userId }, { $set: { 'addresses.$[].isDefault': false } });
      }
      const updated = await User.findOneAndUpdate(
        { _id: userId, 'addresses.9': { $exists: false } },
        { $push: { addresses: addressData } },
        { returnDocument: 'after', runValidators: true }
      );
      if (!updated) {
        const err = new Error('Maximum 10 saved addresses allowed per customer');
        err.statusCode = 400;
        throw err;
      }
      return updated.addresses[updated.addresses.length - 1];
    });
  }

  async updateAddress(userId, addressId, updateData) {
    return withUserLock(userId, async () => {
      const user = await User.findById(userId);
      assertUserAndAddress(user, addressId);
      if (updateData.isDefault === true) {
        const updateFields = { 'addresses.$[other].isDefault': false, 'addresses.$[target].isDefault': true };
        Object.keys(updateData).forEach((k) => {
          if (k !== 'isDefault' && updateData[k] !== undefined) updateFields[`addresses.$[target].${k}`] = updateData[k];
        });
        const updated = await User.findOneAndUpdate(
          { _id: userId, 'addresses._id': addressId },
          { $set: updateFields },
          { arrayFilters: [{ 'other._id': { $ne: addressId } }, { 'target._id': addressId }], returnDocument: 'after' }
        );
        return updated.addresses.find((a) => String(a._id) === String(addressId));
      }
      const updateFields = {};
      Object.keys(updateData).forEach((k) => {
        if (updateData[k] !== undefined) updateFields[`addresses.$.${k}`] = updateData[k];
      });
      const updated = await User.findOneAndUpdate(
        { _id: userId, 'addresses._id': addressId },
        { $set: updateFields },
        { returnDocument: 'after' }
      );
      return updated.addresses.find((a) => String(a._id) === String(addressId));
    });
  }

  async deleteAddress(userId, addressId) {
    return withUserLock(userId, async () => {
      const user = await User.findById(userId);
      assertUserAndAddress(user, addressId);
      await User.findOneAndUpdate(
        { _id: userId, 'addresses._id': addressId },
        { $pull: { addresses: { _id: addressId } } },
        { returnDocument: 'after' }
      );
      return true;
    });
  }
}

export const addressService = new AddressService();
