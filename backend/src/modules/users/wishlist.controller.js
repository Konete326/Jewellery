import { User } from './user.model.js';
import { Gallery } from '../gallery/gallery.model.js';
import { sendSuccess, sendError } from '../../utils/apiResponse.js';

export class WishlistController {
  async getWishlist(req, res, next) {
    try {
      const { email } = req.params;
      if (!email) return sendError(res, 400, 'User email is required');
      const user = await User.findOne({ email: email.toLowerCase().trim() });
      if (!user) return sendSuccess(res, 200, 'Wishlist empty', { ids: [], items: [] });

      const ids = user.wishlist || [];
      const items = await Gallery.find({ _id: { $in: ids }, isActive: true })
        .select('_id title description category imageUrl averageRating reviewCount')
        .lean();

      return sendSuccess(res, 200, 'Wishlist retrieved', { ids, items });
    } catch (error) {
      next(error);
    }
  }

  async toggleWishlist(req, res, next) {
    try {
      const { email, pieceId } = req.body;
      if (!email || !pieceId) return sendError(res, 400, 'Email and pieceId are required');

      let user = await User.findOne({ email: email.toLowerCase().trim() });
      if (!user) return sendError(res, 404, 'User account not found');

      const pieceIdStr = String(pieceId);
      const exists = user.wishlist.includes(pieceIdStr);

      if (exists) {
        user.wishlist = user.wishlist.filter((id) => id !== pieceIdStr);
      } else {
        user.wishlist.push(pieceIdStr);
      }

      await user.save();
      return sendSuccess(res, 200, exists ? 'Removed from vault' : 'Saved to vault', {
        added: !exists,
        wishlist: user.wishlist
      });
    } catch (error) {
      next(error);
    }
  }

  async syncWishlist(req, res, next) {
    try {
      const { email, pieceIds = [] } = req.body;
      if (!email) return sendError(res, 400, 'User email is required');

      let user = await User.findOne({ email: email.toLowerCase().trim() });
      if (!user) return sendError(res, 404, 'User account not found');

      const existingSet = new Set(user.wishlist || []);
      for (const id of pieceIds) {
        if (id) existingSet.add(String(id));
      }
      user.wishlist = Array.from(existingSet);
      await user.save();

      const items = await Gallery.find({ _id: { $in: user.wishlist }, isActive: true })
        .select('_id title description category imageUrl averageRating reviewCount')
        .lean();

      return sendSuccess(res, 200, 'Wishlist synchronized', {
        ids: user.wishlist,
        items
      });
    } catch (error) {
      next(error);
    }
  }
}

export const wishlistController = new WishlistController();
