import { userRepository } from './user.repository.js';
import { Inquiry } from '../inquiries/inquiry.model.js';

export class UserAdminService {
  async updateUserRole(id, role) {
    if (!['customer', 'admin'].includes(role)) {
      throw new Error('Invalid user role specified');
    }
    return await userRepository.update(id, { role });
  }

  async updateUserStatus(id, isActive) {
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

  async deleteUser(id) {
    return await userRepository.deleteById(id);
  }
}

export const userAdminService = new UserAdminService();
