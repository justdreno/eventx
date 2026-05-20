import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils';

export function validate(schema: Record<string, unknown>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    // Placeholder: schema validation with zod/joi
    next();
  };
}
