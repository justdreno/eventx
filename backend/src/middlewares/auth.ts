import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { sendError } from '../utils';

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

export function authenticate(req: AuthRequest, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return sendError(_res, 'Authentication required', 401);
  }

  const token = header.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as { userId: string; role: string };
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch {
    return sendError(_res, 'Invalid or expired token', 401);
  }
}

export function authorize(...roles: string[]) {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.userRole || !roles.includes(req.userRole)) {
      return sendError(_res, 'Insufficient permissions', 403);
    }
    next();
  };
}
