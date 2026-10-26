import cron from 'node-cron';
import { rateService } from './rate.service.js';
import { rateRepository } from './rate.repository.js';
import { logger } from '../../utils/logger.js';

let middayJob = null;
let eveningJob = null;
let schedulerStatus = {
  enabled: true,
  timezone: 'Asia/Karachi',
  schedules: [
    { name: 'Midday Declaration', time: '1:30 PM PKT', cron: '30 13 * * *' },
    { name: 'Evening Closing', time: '6:00 PM PKT', cron: '0 18 * * *' }
  ],
  lastRunAt: null,
  lastRunSlot: null,
  lastRunStatus: 'idle',
  lastRunMessage: 'Scheduler active. Awaiting Sarafa market declaration.'
};

async function runSync(slotName, retryCount = 0) {
  try {
    const current = await rateRepository.getActiveRate();
    if (current?.isManualOverride) {
      schedulerStatus.lastRunAt = new Date();
      schedulerStatus.lastRunSlot = slotName;
      schedulerStatus.lastRunStatus = 'skipped';
      schedulerStatus.lastRunMessage = 'Skipped auto-sync to preserve active custom atelier benchmark.';
      logger.info(`[Rate Scheduler] ${slotName}: Manual override active, skipping auto-sync.`);
      return;
    }

    const dayName = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Karachi',
      weekday: 'long'
    }).format(new Date());

    const updated = await rateService.syncLiveRates(`Sarafa Auto-Sync (${slotName})`);
    schedulerStatus.lastRunAt = new Date();
    schedulerStatus.lastRunSlot = slotName;
    schedulerStatus.lastRunStatus = 'success';
    schedulerStatus.lastRunMessage = dayName === 'Sunday'
      ? `Verified Sunday market pause. Saturday benchmark maintained (24K: Rs ${updated?.gold?.['24K']?.tola || 'N/A'}).`
      : `Synced at ${new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Karachi' })} PKT. 24K: Rs ${updated?.gold?.['24K']?.tola || 'N/A'}`;
    logger.info(`[Rate Scheduler] ${slotName} sync completed successfully.`);
  } catch (err) {
    logger.error(`[Rate Scheduler] ${slotName} sync failed: ${err.message}`);
    schedulerStatus.lastRunAt = new Date();
    schedulerStatus.lastRunSlot = slotName;
    schedulerStatus.lastRunStatus = 'error';
    schedulerStatus.lastRunMessage = `Sync failed: ${err.message}`;

    if (retryCount < 2) {
      const delayMs = (retryCount + 1) * 300000;
      setTimeout(() => {
        runSync(`${slotName} (Retry #${retryCount + 1})`, retryCount + 1);
      }, delayMs);
    }
  }
}

export function startRateScheduler() {
  if (middayJob) middayJob.stop();
  if (eveningJob) eveningJob.stop();

  middayJob = cron.schedule(
    '30 13 * * *',
    () => {
      runSync('1:30 PM Market Declaration');
    },
    { timezone: 'Asia/Karachi' }
  );

  eveningJob = cron.schedule(
    '0 18 * * *',
    () => {
      runSync('6:00 PM Closing Declaration');
    },
    { timezone: 'Asia/Karachi' }
  );

  schedulerStatus.enabled = true;
  logger.info('[Rate Scheduler] Daily Sarafa auto-sync cron active for 1:30 PM & 6:00 PM Asia/Karachi.');
}

export function stopRateScheduler() {
  if (middayJob) middayJob.stop();
  if (eveningJob) eveningJob.stop();
  schedulerStatus.enabled = false;
  schedulerStatus.lastRunMessage = 'Scheduler paused.';
}

export function getSchedulerStatus() {
  return {
    ...schedulerStatus,
    serverTimePKT: new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Karachi' }),
    serverDatePKT: new Date().toLocaleDateString('en-US', { timeZone: 'Asia/Karachi' })
  };
}

export async function triggerManualScheduledSync() {
  return runSync('Manual Admin Test Trigger');
}
