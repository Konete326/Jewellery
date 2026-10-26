import { Rate, RateLog } from './rate.model.js';

export const rateRepository = {
  async getActiveRate() {
    return Rate.findOne().sort({ updatedAt: -1 }).lean();
  },

  async upsertActiveRate(rateData) {
    const existing = await Rate.findOne().sort({ updatedAt: -1 });
    if (existing) {
      Object.assign(existing, rateData);
      existing.updatedAt = new Date();
      return existing.save();
    }
    return Rate.create(rateData);
  },

  async logChange(logData) {
    return RateLog.create(logData);
  },

  async getLogs(limit = 50) {
    return RateLog.find().sort({ createdAt: -1 }).limit(limit).lean();
  },

  async deleteLog(id) {
    return RateLog.findByIdAndDelete(id);
  }
};
