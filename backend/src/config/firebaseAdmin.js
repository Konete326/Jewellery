import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { ENV } from './env.js';
import { logger } from '../utils/logger.js';

let firebaseAuthInstance = null;

export const getFirebaseAuth = () => {
  if (firebaseAuthInstance) return firebaseAuthInstance;

  try {
    let app;
    const apps = getApps();
    if (!apps.length) {
      if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        let creds;
        try {
          creds = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        } catch {
          creds = process.env.FIREBASE_SERVICE_ACCOUNT;
        }
        app = initializeApp({
          credential: cert(creds),
          projectId: ENV.FIREBASE_PROJECT_ID
        });
      } else {
        app = initializeApp({
          projectId: ENV.FIREBASE_PROJECT_ID
        });
      }
    } else {
      app = apps[0];
    }
    firebaseAuthInstance = getAuth(app);
    return firebaseAuthInstance;
  } catch (error) {
    logger.warn(`Firebase Admin Auth initialization warning: ${error.message}`);
    return null;
  }
};

export default getFirebaseAuth;
