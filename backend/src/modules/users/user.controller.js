import { userService } from './user.service.js';
import { userAdminService } from './user.admin.service.js';
import { sanitizeUser } from './user.auth.helper.js';
import { sendSuccess, sendError } from '../../utils/apiResponse.js';

export class UserController {
  async googleAuth(req, res, next) {
    try {
      const { email, name, avatar, googleId } = req.body;
      if (!email) {
        return sendError(res, 400, 'Google account email is required');
      }
      const data = await userService.syncGoogleUser({ email, name, avatar, googleId });
      return sendSuccess(res, 200, 'Google authentication successful', data);
    } catch (error) {
      return sendError(res, 400, error.message);
    }
  }

  async register(req, res, next) {
    try {
      const { name, email, password } = req.body;
      const ip = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'Unknown').toString().split(',')[0].trim();
      const data = await userService.registerLocalUser({ name, email, password, ip });
      return sendSuccess(res, 201, 'Account created successfully', data);
    } catch (error) {
      return sendError(res, 400, error.message);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const ip = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'Unknown').toString().split(',')[0].trim();
      const data = await userService.loginLocalUser({ email, password, ip });
      return sendSuccess(res, 200, 'Sign in successful', data);
    } catch (error) {
      return sendError(res, 401, error.message);
    }
  }

  async getMe(req, res, next) {
    try {
      return sendSuccess(res, 200, 'Profile retrieved', sanitizeUser(req.user));
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      return sendSuccess(res, 200, 'Users retrieved successfully', users);
    } catch (error) {
      next(error);
    }
  }

  async updateRole(req, res, next) {
    try {
      const { id } = req.params;
      const { role } = req.body;
      const updated = await userAdminService.updateUserRole(id, role, req.user);
      return sendSuccess(res, 200, 'User role updated', updated);
    } catch (error) {
      return sendError(res, 400, error.message);
    }
  }

  async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { isActive } = req.body;
      const updated = await userAdminService.updateUserStatus(id, isActive, req.user);
      return sendSuccess(res, 200, `User account ${isActive ? 'activated' : 'deactivated'}`, updated);
    } catch (error) {
      return sendError(res, 400, error.message);
    }
  }

  async getActivities(req, res, next) {
    try {
      const { id } = req.params;
      const data = await userAdminService.getUserActivities(id);
      return sendSuccess(res, 200, 'User activities retrieved', data);
    } catch (error) {
      return sendError(res, 404, error.message);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await userAdminService.deleteUser(id, req.user);
      return sendSuccess(res, 200, 'User removed successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();
