import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';
import { getFirebaseAuth } from '../config/firebaseAdmin.js';
import { User } from '../modules/users/user.model.js';
import { sendError } from '../utils/apiResponse.js';

export const verifyAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 401, 'Unauthorized: Missing or invalid authentication token');
  }

  const token = authHeader.split(' ')[1].trim();

  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || user.isActive === false) {
      return sendError(res, 401, 'Account suspended or no longer exists');
    }
    req.user = user;
    req.auth = { uid: user._id.toString(), email: user.email, role: user.role };
    return next();
  } catch (jwtErr) {
    const fbAuth = getFirebaseAuth();
    if (!fbAuth) {
      return sendError(res, 401, 'Invalid or expired authentication token');
    }

    try {
      const decodedFb = await fbAuth.verifyIdToken(token);
      const email = decodedFb.email?.toLowerCase().trim();
      const googleId = decodedFb.uid;

      const orConditions = [];
      if (googleId) orConditions.push({ googleId });
      if (email) orConditions.push({ email });

      let user = orConditions.length ? await User.findOne({ $or: orConditions }) : null;

      if (!user && email) {
        user = await User.create({
          name: decodedFb.name || 'Valued Patron',
          email,
          googleId: googleId || '',
          authProvider: 'google',
          role: 'customer',
          lastLoginAt: new Date()
        });
      }

      if (!user || user.isActive === false) {
        return sendError(res, 401, 'Account suspended or no longer exists');
      }

      req.user = user;
      req.auth = { uid: user._id.toString(), email: user.email, role: user.role, firebaseUid: googleId };
      return next();
    } catch (fbErr) {
      return sendError(res, 401, 'Invalid or expired authentication token');
    }
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return sendError(res, 403, 'Forbidden: Administrative privileges required');
  }
  next();
};

export const requireStaff = (req, res, next) => {
  if (!req.user || !['admin', 'staff'].includes(req.user.role)) {
    return sendError(res, 403, 'Forbidden: Staff or administrative privileges required');
  }
  next();
};

export const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }
  const token = authHeader.split(' ')[1].trim();
  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (user && user.isActive !== false) {
      req.user = user;
      req.auth = { uid: user._id.toString(), email: user.email, role: user.role };
    }
  } catch {}
  next();
};
