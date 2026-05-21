import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { sendSuccess, sendError } from '../utils';
import type { AuthRequest } from '../middlewares';

export class LiveUpdateController {
  async getByEvent(req: Request, res: Response, _next: NextFunction) {
    try {
      const eventId = req.params.eventId as string;
      const updates = await prisma.liveUpdate.findMany({
        where: { eventId },
        orderBy: { timestamp: 'desc' },
      });
      return sendSuccess(res, updates, 'Live updates fetched');
    } catch (err) {
      return sendError(res, (err as Error).message);
    }
  }

  async create(req: AuthRequest, res: Response, _next: NextFunction) {
    try {
      const { eventId, type, content, mediaUrl } = req.body;
      if (!eventId || !content) {
        return sendError(res, 'Event ID and content are required', 400);
      }
      const update = await prisma.liveUpdate.create({
        data: { eventId, type: type || 'announcement', content, mediaUrl: mediaUrl || null },
      });
      return sendSuccess(res, update, 'Live update created', 201);
    } catch (err) {
      return sendError(res, (err as Error).message);
    }
  }
}
