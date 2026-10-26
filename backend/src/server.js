import app from './app.js';
import { ENV } from './config/env.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { logger } from './utils/logger.js';
import { startRateScheduler, stopRateScheduler } from './modules/rates/rate.scheduler.js';
import { startDigestScheduler, stopDigestScheduler } from './modules/rates/rate.digest.scheduler.js';

const startServer = () => {
  const server = app.listen(ENV.PORT, async () => {
    logger.info(`Khalil & Sons Server running in ${ENV.NODE_ENV} mode on port ${ENV.PORT}`);
    await connectDatabase();
    startRateScheduler();
    startDigestScheduler();
  });

  const handleShutdown = (signal) => {
    logger.info(`Received ${signal}. Gracefully shutting down...`);
    stopRateScheduler();
    stopDigestScheduler();
    server.close(async () => {
      await disconnectDatabase();
      logger.info('Database disconnected and server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  process.on('SIGINT', () => handleShutdown('SIGINT'));
};

startServer();
