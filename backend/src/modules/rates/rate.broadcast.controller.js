import { rateBroadcastService } from './rate.broadcast.service.js';

export const rateBroadcastController = {
  async getStats(req, res, next) {
    try {
      const stats = await rateBroadcastService.getBroadcastStats();
      return res.status(200).json({
        success: true,
        data: stats
      });
    } catch (err) {
      next(err);
    }
  },

  async sendBroadcast(req, res, next) {
    try {
      const { recipientFilter } = req.body || {};
      const result = await rateBroadcastService.broadcastRatesToClients({ recipientFilter });
      return res.status(200).json({
        success: true,
        message: `Successfully delivered bullion rates email to ${result.sentCount} clients.`,
        data: result
      });
    } catch (err) {
      next(err);
    }
  }
};
