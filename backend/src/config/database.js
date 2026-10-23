import mongoose from 'mongoose';
import { ENV } from './env.js';
import { logger } from '../utils/logger.js';

export const connectDatabase = async () => {
  try {
    const conn = await mongoose.connect(ENV.MONGODB_URI, {
      serverSelectionTimeoutMS: 3000
    });
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    logger.warn(`MongoDB not connected (${error.message}). Continuing in offline mode.`);
    return null;
  }
};

export const disconnectDatabase = async () => {
  await mongoose.disconnect();
};
