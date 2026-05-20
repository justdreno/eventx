import { Response } from 'express';
import type { ApiResponse } from '../types';

export function sendSuccess<T>(res: Response, data: T, message?: string, statusCode = 200) {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
  };
  return res.status(statusCode).json(response);
}

export function sendError(res: Response, error: string, statusCode = 500) {
  const response: ApiResponse<null> = {
    success: false,
    error,
  };
  return res.status(statusCode).json(response);
}
