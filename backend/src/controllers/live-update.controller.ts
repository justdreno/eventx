import { Request, Response, NextFunction } from 'express';
import { sendSuccess, sendError } from '../utils';

export class LiveUpdateController {
  async getByEvent(req: Request, res: Response, _next: NextFunction) {
    try {
      const { eventId } = req.params;
      return sendSuccess(res, [], `Live updates for event ${eventId} fetched`);
    } catch (err) {
      return sendError(res, (err as Error).message);
    }
  }

  async create(req: Request, res: Response, _next: NextFunction) {
    try {
      return sendSuccess(res, req.body, 'Live update created', 201);
    } catch (err) {
      return sendError(res, (err as Error).message);
    }
  }
}
