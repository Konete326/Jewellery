import dotenv from 'dotenv';

dotenv.config();

export const ENV = {
  PORT: Number(process.env.PORT) || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/khalil_and_sons',
  MONGO_URI_TEST: process.env.MONGO_URI_TEST || '',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  JWT_SECRET: process.env.JWT_SECRET || 'khalil_atelier_jwt_secret_dev_key_2026',
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || 'khalilandsons-bc707',
  FIREBASE_SERVICE_ACCOUNT: process.env.FIREBASE_SERVICE_ACCOUNT || '',
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: Number(process.env.SMTP_PORT) || 465,
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  SMTP_FROM: process.env.SMTP_FROM || '',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || '',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || '',
  TRUST_PROXY: process.env.TRUST_PROXY !== undefined ? process.env.TRUST_PROXY : 'false'
};

export const parseTrustProxy = (raw) => {
  if (raw === undefined || raw === null || raw === '') {
    return false;
  }
  const str = String(raw).trim();
  const lower = str.toLowerCase();
  if (lower === 'false' || lower === '0') return false;
  if (lower === 'true') return true;
  const num = Number(str);
  if (!Number.isNaN(num) && num >= 0) return num;
  return str;
};

export const validateSecurityConfig = () => {
  const issues = [];
  const isProd = ENV.NODE_ENV === 'production';

  if (!process.env.JWT_SECRET) {
    issues.push(isProd ? 'CRITICAL: JWT_SECRET is not set in production' : 'WARNING: Using default development JWT_SECRET');
  } else if (process.env.JWT_SECRET.length < 32) {
    issues.push('WARNING: JWT_SECRET length is under 32 characters; high-entropy string recommended for production');
  }

  if (!process.env.MONGODB_URI) {
    issues.push('CRITICAL: MONGODB_URI is not set');
  }

  if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
    issues.push('NOTICE: FIREBASE_SERVICE_ACCOUNT is not configured. Google ID token backend verification will reject tokens until configured.');
  }

  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    issues.push('NOTICE: Cloudinary credentials incomplete. Media uploads will be limited.');
  }

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    issues.push('NOTICE: SMTP credentials incomplete. Automated email alerts and inquiry replies will not dispatch.');
  }

  return {
    isValid: isProd ? !issues.some((i) => i.startsWith('CRITICAL')) : true,
    issues
  };
};
