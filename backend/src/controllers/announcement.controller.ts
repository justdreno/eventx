import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { sendSuccess, sendError } from '../utils';
import type { AuthRequest } from '../middlewares';

export class AnnouncementController {
  async getAll(req: Request, res: Response, _next: NextFunction) {
    try {
      const { priority } = req.query;

      const where: Record<string, unknown> = {};
      if (priority && priority !== 'all') where.priority = priority;

      const announcements = await prisma.announcement.findMany({
        where,
        include: {
          event: { select: { id: true, title: true, type: true } },
        },
        orderBy: { createdAt: 'desc' },
      });

      return sendSuccess(res, announcements, 'Announcements fetched successfully');
    } catch (err) {
      return sendError(res, (err as Error).message);
    }
  }

  async getByEvent(req: Request, res: Response, _next: NextFunction) {
    try {
      const eventId = req.params.eventId as string;

      const announcements = await prisma.announcement.findMany({
        where: { eventId },
        orderBy: { createdAt: 'desc' },
      });

      return sendSuccess(res, announcements, 'Announcements fetched');
    } catch (err) {
      return sendError(res, (err as Error).message);
    }
  }

  async create(req: AuthRequest, res: Response, _next: NextFunction) {
    try {
      const { title, content, eventId, priority } = req.body;

      if (!title || !content) {
        return sendError(res, 'Title and content are required', 400);
      }

      const announcement = await prisma.announcement.create({
        data: {
          title,
          content,
          eventId: eventId || null,
          priority: priority || 'low',
          createdBy: req.userId!,
        },
        include: {
          event: { select: { id: true, title: true, type: true } },
        },
      });

      return sendSuccess(res, announcement, 'Announcement created', 201);
    } catch (err) {
      return sendError(res, (err as Error).message);
    }
  }

  async delete(req: Request, res: Response, _next: NextFunction) {
    try {
      const id = req.params.id as string;
      await prisma.announcement.delete({ where: { id } });
      return sendSuccess(res, null, 'Announcement deleted');
    } catch (err) {
      return sendError(res, (err as Error).message);
    }
  }
}
