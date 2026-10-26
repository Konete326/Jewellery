import cron from 'node-cron';
import { rateBroadcastService } from './rate.broadcast.service.js';
import { logger } from '../../utils/logger.js';

let digestJob = null;

export function startDigestScheduler() {
  if (digestJob) digestJob.stop();

  digestJob = cron.schedule(
    '0 14 * * *',
    async () => {
      try {
        logger.info('[Digest Scheduler] Running daily check for monthly gold rate digest emails...');
        const result = await rateBroadcastService.sendMonthlyDigestToDueUsers(25);
        logger.info(`[Digest Scheduler] Daily check completed: ${result.sent} emails delivered.`);
      } catch (err) {
        logger.error(`[Digest Scheduler] Daily check encountered error: ${err.message}`);
      }
    },
    { timezone: 'Asia/Karachi' }
  );

  logger.info('[Digest Scheduler] Monthly gold digest scheduler active (Daily 2:00 PM Asia/Karachi).');
}

export function stopDigestScheduler() {
  if (digestJob) {
    digestJob.stop();
    digestJob = null;
  }
}
