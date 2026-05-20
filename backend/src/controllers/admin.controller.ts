import { Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { sendSuccess, sendError } from '../utils';
import type { AuthRequest } from '../middlewares';

export class AdminController {
  async getStats(_req: AuthRequest, res: Response, _next: NextFunction) {
    try {
      const [events, users, registrations, announcements] = await Promise.all([
        prisma.event.count(),
        prisma.user.count(),
        prisma.registration.count(),
        prisma.announcement.count(),
      ]);

      const eventsByStatus = await prisma.event.groupBy({
        by: ['status'],
        _count: { id: true },
      });

      const recentRegistrations = await prisma.registration.findMany({
        take: 10,
        orderBy: { registeredAt: 'desc' },
        include: {
          event: { select: { id: true, title: true, type: true, venue: true, startDate: true, status: true } },
          user: { select: { id: true, name: true, email: true } },
        },
      });

      return sendSuccess(res, {
        counts: { events, users, registrations, announcements },
        eventsByStatus,
        recentRegistrations,
      }, 'Admin stats fetched');
    } catch (err) {
      return sendError(res, (err as Error).message);
    }
  }
}
