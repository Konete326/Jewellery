import { User } from './user.model.js';

export class UserRepository {
  async findByEmail(email) {
    return await User.findOne({ email: email.toLowerCase().trim() });
  }

  async findById(id) {
    return await User.findById(id).select('-password');
  }

  async create(data) {
    return await User.create(data);
  }

  async update(id, data) {
    return await User.findByIdAndUpdate(id, data, { new: true }).select('-password');
  }

  async findAll(filter = {}, sort = { createdAt: -1 }) {
    return await User.find(filter).select('-password').sort(sort).lean();
  }

  async count(filter = {}) {
    return await User.countDocuments(filter);
  }

  async deleteById(id) {
    return await User.findByIdAndDelete(id);
  }
}

export const userRepository = new UserRepository();
