import { storeProfileService } from './storeProfile.service.js';

export const storeProfileController = {
  async get(req, res, next) {
    try {
      const profile = await storeProfileService.getProfile();
      return res.status(200).json({
        success: true,
        data: profile
      });
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const { email, phone } = req.body;
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email address format.'
        });
      }

      const updated = await storeProfileService.updateProfile(req.body);
      return res.status(200).json({
        success: true,
        message: 'Store profile updated successfully.',
        data: updated
      });
    } catch (err) {
      next(err);
    }
  }
};
