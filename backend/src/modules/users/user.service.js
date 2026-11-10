import jwt from 'jsonwebtoken';
import { userRepository } from './user.repository.js';
import { hashPassword, verifyPassword, needsRehash } from './user.password.js';
import { sendLoginAlertEmail } from '../../utils/loginAlertMailer.js';
import { isAdminEmail, isAdminPassword, sanitizeUser } from './user.auth.helper.js';
import { ENV } from '../../config/env.js';

export class UserService {
  generateToken(user) {
    return jwt.sign(
      { id: user._id.toString(), email: user.email, role: user.role },
      ENV.JWT_SECRET,
      { expiresIn: '7d' }
    );
  }

  async syncGoogleUser({ email, name, avatar, googleId }) {
    if (!email) throw new Error('Email is required for Google authentication');
    const normalizedEmail = email.toLowerCase().trim();
    let user = await userRepository.findByEmail(normalizedEmail);

    if (user) {
      if (user.isActive === false) throw new Error('Account deactivated. Contact concierge.');
      user.lastLoginAt = new Date();
      if (isAdminEmail(normalizedEmail)) user.role = 'admin';
      if (avatar && !user.avatar) user.avatar = avatar;
      if (googleId && !user.googleId) user.googleId = googleId;
      await user.save();
      sendLoginAlertEmail({ to: normalizedEmail, userName: user.name, role: user.role, ip: 'Google Auth' }).catch(() => {});
      return { user: sanitizeUser(user), token: this.generateToken(user) };
    }

    const role = isAdminEmail(normalizedEmail) ? 'admin' : 'customer';
    const newUser = await userRepository.create({
      name: name || 'Google Collector',
      email: normalizedEmail,
      avatar: avatar || '',
      googleId: googleId || '',
      authProvider: 'google',
      role,
      lastLoginAt: new Date()
    });

    sendLoginAlertEmail({ to: normalizedEmail, userName: newUser.name, role, ip: 'Google Auth' }).catch(() => {});
    return { user: sanitizeUser(newUser), token: this.generateToken(newUser) };
  }

  async registerLocalUser({ name, email, password, ip = 'Unknown' }) {
    if (!email || !password) throw new Error('Email and password are required');
    const normalizedEmail = email.toLowerCase().trim();
    const existing = await userRepository.findByEmail(normalizedEmail);
    if (existing) throw new Error('An account with this email already exists');

    const fallbackName = name?.trim() || normalizedEmail.split('@')[0] || 'Valued Patron';
    const role = isAdminEmail(normalizedEmail) ? 'admin' : 'customer';
    const user = await userRepository.create({
      name: fallbackName,
      email: normalizedEmail,
      password: hashPassword(password),
      authProvider: 'local',
      role,
      lastLoginAt: new Date()
    });

    sendLoginAlertEmail({ to: normalizedEmail, userName: user.name, role, ip }).catch(() => {});
    return { user: sanitizeUser(user), token: this.generateToken(user) };
  }

  async loginLocalUser({ email, password, ip = 'Unknown' }) {
    if (!email || !password) throw new Error('Email and password are required');
    const normalizedEmail = email.toLowerCase().trim();

    if (isAdminEmail(normalizedEmail)) {
      let adminUser = await userRepository.findByEmail(normalizedEmail);
      const isMatch = isAdminPassword(password) || (adminUser?.password && verifyPassword(password, adminUser.password));
      if (!isMatch) throw new Error('Invalid email or password');

      if (!adminUser) {
        adminUser = await userRepository.create({
          name: 'Atelier Director',
          email: normalizedEmail,
          password: hashPassword(password),
          role: 'admin',
          authProvider: 'local',
          lastLoginAt: new Date()
        });
      } else {
        if (adminUser.password && needsRehash(adminUser.password) && verifyPassword(password, adminUser.password)) {
          adminUser.password = hashPassword(password);
        }
        adminUser.lastLoginAt = new Date();
        adminUser.role = 'admin';
        await adminUser.save();
      }
      sendLoginAlertEmail({ to: normalizedEmail, userName: adminUser.name, role: 'admin', ip }).catch(() => {});
      return { user: sanitizeUser(adminUser), token: this.generateToken(adminUser) };
    }

    const user = await userRepository.findByEmail(normalizedEmail);
    if (!user) throw new Error('Invalid email or password');
    if (user.isActive === false) throw new Error('Account deactivated. Contact concierge.');
    if (user.authProvider === 'google' && !user.password) {
      throw new Error('This account was registered with Google. Please use Google Sign-In.');
    }
    if (!verifyPassword(password, user.password)) throw new Error('Invalid email or password');
    if (needsRehash(user.password)) user.password = hashPassword(password);
    user.lastLoginAt = new Date();
    await user.save();
    sendLoginAlertEmail({ to: normalizedEmail, userName: user.name, role: user.role, ip }).catch(() => {});
    return { user: sanitizeUser(user), token: this.generateToken(user) };
  }

  async getAllUsers() {
    return await userRepository.findAll();
  }
}

export const userService = new UserService();
