import { User } from '../users/user.model.js';
import { rateRepository } from './rate.repository.js';
import { sendGoldDigestEmail } from './rate.mailer.js';
import { logger } from '../../utils/logger.js';

export const rateBroadcastService = {
  async getBroadcastStats() {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const totalUsers = await User.countDocuments({ isActive: { $ne: false } });
    const dueUsers = await User.countDocuments({
      isActive: { $ne: false },
      $or: [
        { lastGoldDigestSentAt: null },
        { lastGoldDigestSentAt: { $lt: thirtyDaysAgo } }
      ]
    });

    const lastBroadcastUser = await User.findOne({ lastGoldDigestSentAt: { $ne: null } })
      .sort({ lastGoldDigestSentAt: -1 })
      .select('lastGoldDigestSentAt');

    return {
      totalUsers,
      dueUsers,
      lastBroadcastAt: lastBroadcastUser?.lastGoldDigestSentAt || null
    };
  },

  async sendMonthlyDigestToDueUsers(batchSize = 25) {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const eligibleUsers = await User.find({
      isActive: { $ne: false },
      $or: [
        { lastGoldDigestSentAt: null },
        { lastGoldDigestSentAt: { $lt: thirtyDaysAgo } }
      ]
    }).limit(batchSize);

    if (!eligibleUsers.length) {
      return { processed: 0, sent: 0, failed: 0 };
    }

    const rates = await rateRepository.getActiveRate();
    if (!rates) {
      logger.warn('[Rate Broadcast] No active bullion rates found.');
      return { processed: 0, sent: 0, failed: 0 };
    }

    let sent = 0;
    let failed = 0;

    for (const user of eligibleUsers) {
      try {
        await sendGoldDigestEmail({
          to: user.email,
          clientName: user.name,
          rates
        });
        user.lastGoldDigestSentAt = new Date();
        await user.save();
        sent += 1;
      } catch (err) {
        failed += 1;
        logger.error(`[Rate Broadcast] Failed to send email to ${user.email}: ${err.message}`);
      }
    }

    logger.info(`[Rate Broadcast] Monthly digest sent: ${sent} succeeded, ${failed} failed.`);
    return { processed: eligibleUsers.length, sent, failed };
  },

  async broadcastRatesToClients({ recipientFilter = 'all' } = {}) {
    const rates = await rateRepository.getActiveRate();
    if (!rates) {
      const err = new Error('No active bullion rates found to broadcast');
      err.statusCode = 400;
      throw err;
    }

    const query = { isActive: { $ne: false } };
    if (recipientFilter === 'due') {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      query.$or = [
        { lastGoldDigestSentAt: null },
        { lastGoldDigestSentAt: { $lt: thirtyDaysAgo } }
      ];
    }

    const recipients = await User.find(query);
    if (!recipients.length) {
      return { totalRecipients: 0, sentCount: 0, failedCount: 0 };
    }

    let sentCount = 0;
    let failedCount = 0;

    for (const user of recipients) {
      try {
        await sendGoldDigestEmail({
          to: user.email,
          clientName: user.name,
          rates
        });
        user.lastGoldDigestSentAt = new Date();
        await user.save();
        sentCount += 1;
      } catch (err) {
        failedCount += 1;
        logger.error(`[Rate Broadcast] Failed to send broadcast to ${user.email}: ${err.message}`);
      }
    }

    return { totalRecipients: recipients.length, sentCount, failedCount };
  }
};
