import { userRepository } from './user.repository.js';
import { hashPassword, verifyPassword } from './user.password.js';
import { sendLoginAlertEmail } from '../../utils/loginAlertMailer.js';
import { isAdminEmail, isAdminPassword, sanitizeUser } from './user.auth.helper.js';

export class UserService {
  async syncGoogleUser({ email, name, avatar, googleId }) {
    if (!email) throw new Error('Email is required for Google authentication');
    const normalizedEmail = email.toLowerCase().trim();
    let user = await userRepository.findByEmail(normalizedEmail);
    const role = isAdminEmail(normalizedEmail) ? 'admin' : 'customer';

    if (user) {
      if (user.isActive === false) {
        throw new Error('This account has been deactivated. Please contact boutique concierge.');
      }
      user.lastLoginAt = new Date();
      if (role === 'admin') user.role = 'admin';
      if (avatar && !user.avatar) user.avatar = avatar;
      if (googleId && !user.googleId) user.googleId = googleId;
      await user.save();
      sendLoginAlertEmail({ to: normalizedEmail, userName: user.name, role: user.role, ip: 'Google Auth' }).catch(() => {});
      return sanitizeUser(user);
    }

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
    return sanitizeUser(newUser);
  }

  async registerLocalUser({ name, email, password, ip = 'Unknown' }) {
    if (!name || !email || !password) throw new Error('Name, email, and password are required');
    const normalizedEmail = email.toLowerCase().trim();
    const existing = await userRepository.findByEmail(normalizedEmail);
    if (existing) throw new Error('An account with this email already exists');

    const role = isAdminEmail(normalizedEmail) ? 'admin' : 'customer';
    const user = await userRepository.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashPassword(password),
      authProvider: 'local',
      role,
      lastLoginAt: new Date()
    });

    sendLoginAlertEmail({ to: normalizedEmail, userName: user.name, role, ip }).catch(() => {});
    return sanitizeUser(user);
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
        adminUser.lastLoginAt = new Date();
        adminUser.role = 'admin';
        await adminUser.save();
      }
      sendLoginAlertEmail({ to: normalizedEmail, userName: adminUser.name, role: 'admin', ip }).catch(() => {});
      return sanitizeUser(adminUser);
    }

    const user = await userRepository.findByEmail(normalizedEmail);
    if (!user) throw new Error('Invalid email or password');
    if (user.isActive === false) {
      throw new Error('This account has been deactivated. Please contact boutique concierge.');
    }
    if (user.authProvider === 'google' && !user.password) {
      throw new Error('This account was registered with Google. Please use Google Sign-In.');
    }

    if (!verifyPassword(password, user.password)) {
      throw new Error('Invalid email or password');
    }

    user.lastLoginAt = new Date();
    await user.save();
    sendLoginAlertEmail({ to: normalizedEmail, userName: user.name, role: user.role, ip }).catch(() => {});
    return sanitizeUser(user);
  }

  async getAllUsers() {
    return await userRepository.findAll();
  }
}

export const userService = new UserService();
