import { userRepository } from './user.repository.js';
import { hashPassword, verifyPassword } from './user.password.js';
import { sendLoginAlertEmail } from '../../utils/loginAlertMailer.js';

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin@gmail.com').toLowerCase().trim();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

const sanitize = (user) => {
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.password;
  return obj;
};

export class UserService {
  async syncGoogleUser({ email, name, avatar, googleId }) {
    if (!email) throw new Error('Email is required for Google authentication');
    const normalizedEmail = email.toLowerCase().trim();
    let user = await userRepository.findByEmail(normalizedEmail);

    if (user) {
      user.lastLoginAt = new Date();
      if (avatar && !user.avatar) user.avatar = avatar;
      if (googleId && !user.googleId) user.googleId = googleId;
      await user.save();
      sendLoginAlertEmail({ to: normalizedEmail, userName: user.name, role: user.role, ip: 'Google Auth' }).catch(() => {});
      return sanitize(user);
    }

    const role = normalizedEmail === ADMIN_EMAIL ? 'admin' : 'customer';
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
    return sanitize(newUser);
  }

  async registerLocalUser({ name, email, password, ip = 'Unknown' }) {
    if (!name || !email || !password) throw new Error('Name, email, and password are required');
    const normalizedEmail = email.toLowerCase().trim();
    const existing = await userRepository.findByEmail(normalizedEmail);
    if (existing) throw new Error('An account with this email already exists');

    const role = normalizedEmail === ADMIN_EMAIL ? 'admin' : 'customer';
    const user = await userRepository.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashPassword(password),
      authProvider: 'local',
      role,
      lastLoginAt: new Date()
    });

    sendLoginAlertEmail({ to: normalizedEmail, userName: user.name, role, ip }).catch(() => {});
    return sanitize(user);
  }

  async loginLocalUser({ email, password, ip = 'Unknown' }) {
    if (!email || !password) throw new Error('Email and password are required');
    const normalizedEmail = email.toLowerCase().trim();

    if (normalizedEmail === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      let adminUser = await userRepository.findByEmail(normalizedEmail);
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
      return sanitize(adminUser);
    }

    const user = await userRepository.findByEmail(normalizedEmail);
    if (!user) throw new Error('Invalid email or password');

    if (user.authProvider === 'google' && !user.password) {
      throw new Error('This account was registered with Google. Please use Google Sign-In.');
    }

    const isValid = verifyPassword(password, user.password);
    if (!isValid) throw new Error('Invalid email or password');

    user.lastLoginAt = new Date();
    await user.save();
    sendLoginAlertEmail({ to: normalizedEmail, userName: user.name, role: user.role, ip }).catch(() => {});
    return sanitize(user);
  }

  async getAllUsers() {
    return await userRepository.findAll();
  }

  async updateUserRole(id, role) {
    if (!['customer', 'admin'].includes(role)) throw new Error('Invalid user role');
    return await userRepository.update(id, { role });
  }

  async deleteUser(id) {
    return await userRepository.delete(id);
  }
}

export const userService = new UserService();
