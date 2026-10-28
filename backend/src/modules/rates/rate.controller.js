import { rateService, getVerifiedBenchmark } from './rate.service.js';
import { getSchedulerStatus, triggerManualScheduledSync } from './rate.scheduler.js';

export const rateController = {
  async getRates(req, res, next) {
    try {
      res.setHeader('Cache-Control', 'public, max-age=30, stale-while-revalidate=120');
      const rates = await rateService.getCurrentRates();
      return res.status(200).json({
        success: true,
        data: rates
      });
    } catch {
      return res.status(200).json({
        success: true,
        data: getVerifiedBenchmark()
      });
    }
  },

  async syncRates(req, res, next) {
    try {
      const user = req.body?.updatedBy || 'Artisan Admin';
      const updated = await rateService.syncLiveRates(user);
      return res.status(200).json({
        success: true,
        message: 'Rates successfully synchronized with Karachi Sarafa Market (gold.pk).',
        data: updated
      });
    } catch (err) {
      next(err);
    }
  },

  async updateOverride(req, res, next) {
    try {
      const { gold24kTola, silver24kTola } = req.body;
      const gNum = Number(gold24kTola);
      const sNum = Number(silver24kTola);
      if (!gNum || gNum < 150000 || gNum > 1000000) {
        return res.status(400).json({
          success: false,
          message: 'Valid 24K Gold rate between PKR 150,000 and 1,000,000 is required.'
        });
      }
      if (silver24kTola !== undefined && (sNum < 2000 || sNum > 50000)) {
        return res.status(400).json({
          success: false,
          message: 'Valid Silver rate between PKR 2,000 and 50,000 is required.'
        });
      }
      const user = req.body?.updatedBy || 'Artisan Admin';
      const updated = await rateService.overrideRates(req.body, user);
      return res.status(200).json({
        success: true,
        message: 'Rates updated and auto-calculated across all karats.',
        data: updated
      });
    } catch (err) {
      next(err);
    }
  },

  async getHistory(req, res, next) {
    try {
      const limit = Number(req.query.limit) || 50;
      const history = await rateService.getRateHistory(limit);
      return res.status(200).json({
        success: true,
        data: history
      });
    } catch (err) {
      next(err);
    }
  },

  async deleteHistory(req, res, next) {
    try {
      const { id } = req.params;
      await rateService.deleteRateHistory(id);
      return res.status(200).json({
        success: true,
        message: 'Rate log entry removed.'
      });
    } catch (err) {
      next(err);
    }
  },

  async getScheduler(req, res, next) {
    try {
      const status = getSchedulerStatus();
      return res.status(200).json({
        success: true,
        data: status
      });
    } catch (err) {
      next(err);
    }
  },

  async triggerScheduler(req, res, next) {
    try {
      await triggerManualScheduledSync();
      const status = getSchedulerStatus();
      return res.status(200).json({
        success: true,
        message: 'Scheduled auto-sync task executed.',
        data: status
      });
    } catch (err) {
      next(err);
    }
  }
};
