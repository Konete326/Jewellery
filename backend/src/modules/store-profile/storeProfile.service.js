import { StoreProfile } from './storeProfile.model.js';

export const storeProfileService = {
  async getProfile() {
    let profile = await StoreProfile.findOne();
    if (!profile) {
      profile = await StoreProfile.create({});
    }
    return profile;
  },

  async updateProfile(data) {
    const payload = { ...data };
    if (payload.email) {
      payload.email = payload.email.trim().toLowerCase();
    }
    if (payload.phone) {
      payload.phone = payload.phone.trim();
    }
    if (payload.whatsapp) {
      const cleanDigits = String(payload.whatsapp).replace(/[^0-9]/g, '');
      payload.whatsappClean = cleanDigits.startsWith('0')
        ? `92${cleanDigits.slice(1)}`
        : cleanDigits;
      payload.whatsapp = payload.whatsapp.trim();
    }

    let profile = await StoreProfile.findOne();
    if (!profile) {
      profile = await StoreProfile.create(payload);
    } else {
      Object.assign(profile, payload);
      await profile.save();
    }
    return profile;
  }
};

