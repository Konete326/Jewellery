import { userService } from './user.service.js';
import { sendSuccess, sendError } from '../../utils/apiResponse.js';

export class UserController {
  async googleAuth(req, res, next) {
    try {
      const { email, name, avatar, googleId } = req.body;
      if (!email) {
        return sendError(res, 400, 'Google account email is required');
      }
      const user = await userService.syncGoogleUser({ email, name, avatar, googleId });
      return sendSuccess(res, 200, 'Google authentication successful', user);
    } catch (error) {
      return sendError(res, 400, error.message);
    }
  }

  async register(req, res, next) {
    try {
      const { name, email, password } = req.body;
      const ip = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'Unknown').toString().split(',')[0].trim();
      const user = await userService.registerLocalUser({ name, email, password, ip });
      return sendSuccess(res, 201, 'Account created successfully', user);
    } catch (error) {
      return sendError(res, 400, error.message);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const ip = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'Unknown').toString().split(',')[0].trim();
      const user = await userService.loginLocalUser({ email, password, ip });
      return sendSuccess(res, 200, 'Sign in successful', user);
    } catch (error) {
      return sendError(res, 401, error.message);
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
      const updated = await userService.updateUserRole(id, role);
      return sendSuccess(res, 200, 'User role updated', updated);
    } catch (error) {
      return sendError(res, 400, error.message);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await userService.deleteUser(id);
      return sendSuccess(res, 200, 'User removed successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();
