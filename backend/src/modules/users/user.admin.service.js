import { userRepository } from './user.repository.js';
import { User } from './user.model.js';
import { Inquiry } from '../inquiries/inquiry.model.js';

export class UserAdminService {
  async updateUserRole(id, role, operator = null) {
    if (!['customer', 'staff', 'admin'].includes(role)) {
      throw new Error('Invalid role specified. Allowed roles: customer, staff, admin');
    }

    const target = await userRepository.findById(id);
    if (!target) {
      throw new Error('Target user account not found');
    }

    if (operator && operator._id.toString() === id.toString() && role !== 'admin') {
      throw new Error('Cannot demote your own administrator account');
    }

    if (target.role === 'admin' && role !== 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin', isActive: true });
      if (adminCount <= 1) {
        throw new Error('Cannot modify role of the last remaining administrator account');
      }
    }

    return await userRepository.update(id, { role });
  }

  async updateUserStatus(id, isActive, operator = null) {
    const target = await userRepository.findById(id);
    if (!target) {
      throw new Error('Target user account not found');
    }

    if (operator && operator._id.toString() === id.toString() && !isActive) {
      throw new Error('Cannot deactivate your own administrator account');
    }

    if (target.role === 'admin' && !isActive) {
      const adminCount = await User.countDocuments({ role: 'admin', isActive: true });
      if (adminCount <= 1) {
        throw new Error('Cannot deactivate the last remaining administrator account');
      }
    }

    return await userRepository.update(id, { isActive: Boolean(isActive) });
  }

  async getUserActivities(id) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error('Client account not found');
    }

    const inquiries = await Inquiry.find({
      email: user.email.toLowerCase().trim()
    })
      .sort({ createdAt: -1 })
      .lean();

    return {
      user,
      stats: {
        inquiriesCount: inquiries.length,
        wishlistCount: Array.isArray(user.wishlist) ? user.wishlist.length : 0,
        repliedCount: inquiries.filter((inq) => inq.status === 'Replied' || inq.replies?.length > 0).length,
        pendingCount: inquiries.filter((inq) => inq.status === 'Pending').length
      },
      inquiries
    };
  }

  async deleteUser(id, operator = null) {
    const target = await userRepository.findById(id);
    if (!target) {
      throw new Error('Target user account not found');
    }

    if (operator && operator._id.toString() === id.toString()) {
      throw new Error('Cannot delete your own administrator account');
    }

    if (target.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin', isActive: true });
      if (adminCount <= 1) {
        throw new Error('Cannot delete the last remaining administrator account');
      }
    }

    return await userRepository.deleteById(id);
  }
}

export const userAdminService = new UserAdminService();
