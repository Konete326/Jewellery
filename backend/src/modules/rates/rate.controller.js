import { rateService } from './rate.service.js';
import { getSchedulerStatus, triggerManualScheduledSync } from './rate.scheduler.js';

export const rateController = {
  async getRates(req, res, next) {
    try {
      const rates = await rateService.getCurrentRates();
      return res.status(200).json({
        success: true,
        data: rates
      });
    } catch (err) {
      next(err);
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
      if (!gold24kTola || Number(gold24kTola) <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Valid 24K Gold price per Tola is required.'
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
