import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { config } from '../config';
import { sendSuccess, sendError } from '../utils';
import type { AuthRequest } from '../middlewares';

export class AuthController {
  async register(req: Request, res: Response, _next: NextFunction) {
    try {
      const { name, email, password, role } = req.body;

      if (!name || !email || !password) {
        return sendError(res, 'Name, email, and password are required', 400);
      }

      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return sendError(res, 'A user with this email already exists', 409);
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = await prisma.user.create({
        data: { name, email, password: hashedPassword, role: role || 'student' },
      });

      const token = jwt.sign(
        { userId: user.id, role: user.role },
        config.jwtSecret,
        { expiresIn: config.jwtExpiresIn as any },
      );

      return sendSuccess(res, {
        user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
        token,
      }, 'Registration successful', 201);
    } catch (err) {
      return sendError(res, (err as Error).message);
    }
  }

  async login(req: Request, res: Response, _next: NextFunction) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return sendError(res, 'Email and password are required', 400);
      }

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return sendError(res, 'Invalid email or password', 401);
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return sendError(res, 'Invalid email or password', 401);
      }

      const token = jwt.sign(
        { userId: user.id, role: user.role },
        config.jwtSecret,
        { expiresIn: config.jwtExpiresIn as any },
      );

      return sendSuccess(res, {
        user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
        token,
      }, 'Login successful');
    } catch (err) {
      return sendError(res, (err as Error).message);
    }
  }

  async me(req: AuthRequest, res: Response, _next: NextFunction) {
    try {
      const user = await prisma.user.findUnique({ where: { id: req.userId } });
      if (!user) {
        return sendError(res, 'User not found', 404);
      }

      return sendSuccess(res, {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      });
    } catch (err) {
      return sendError(res, (err as Error).message);
    }
  }
}
