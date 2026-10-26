import { ENV } from './env.js';

export const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [ENV.CLIENT_URL, 'http://localhost:5173', 'http://localhost:5000', 'http://localhost:3000', 'http://127.0.0.1:5173', 'http://127.0.0.1:5000'];
    if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS policy'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
