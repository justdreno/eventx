import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { sendSuccess, sendError } from '../utils';
import type { AuthRequest } from '../middlewares';

export class AdminController {
  async getStats(_req: AuthRequest, res: Response, _next: NextFunction) {
    try {
      const [events, users, registrations, announcements, liveUpdates] = await Promise.all([
        prisma.event.count(),
        prisma.user.count(),
        prisma.registration.count(),
        prisma.announcement.count(),
        prisma.liveUpdate.count(),
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
        counts: { events, users, registrations, announcements, liveUpdates },
        eventsByStatus,
        recentRegistrations,
      }, 'Admin stats fetched');
    } catch (err) {
      return sendError(res, (err as Error).message);
    }
  }

  async getEvents(req: Request, res: Response, _next: NextFunction) {
    try {
      const { type, status, search } = req.query;
      const where: Record<string, unknown> = {};
      if (type && type !== 'all') where.type = type;
      if (status && status !== 'all') where.status = status;
      if (search) {
        where.OR = [
          { title: { contains: search as string } },
          { description: { contains: search as string } },
          { venue: { contains: search as string } },
        ];
      }

      const events = await prisma.event.findMany({
        where,
        orderBy: { startDate: 'desc' },
        include: {
          _count: { select: { registrations: true } },
          createdByUser: { select: { id: true, name: true } },
        },
      });

      return sendSuccess(res, events, 'Events fetched');
    } catch (err) {
      return sendError(res, (err as Error).message);
    }
  }

  async getUsers(_req: AuthRequest, res: Response, _next: NextFunction) {
    try {
      const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          _count: { select: { registrations: true, events: true } },
        },
      });
      return sendSuccess(res, users, 'Users fetched');
    } catch (err) {
      return sendError(res, (err as Error).message);
    }
  }

  async updateUser(req: AuthRequest, res: Response, _next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { role } = req.body;
      if (role && !['student', 'teacher', 'admin', 'parent'].includes(role)) {
        return sendError(res, 'Invalid role', 400);
      }
      const user = await prisma.user.update({
        where: { id },
        data: { role },
        select: { id: true, name: true, email: true, role: true, createdAt: true },
      });
      return sendSuccess(res, user, 'User updated');
    } catch (err) {
      return sendError(res, (err as Error).message);
    }
  }

  async getRegistrations(req: Request, res: Response, _next: NextFunction) {
    try {
      const { eventId, checkedIn } = req.query;
      const where: Record<string, unknown> = {};
      if (eventId) where.eventId = eventId;
      if (checkedIn === 'true') where.checkedIn = true;
      if (checkedIn === 'false') where.checkedIn = false;

      const registrations = await prisma.registration.findMany({
        where,
        orderBy: { registeredAt: 'desc' },
        include: {
          event: { select: { id: true, title: true, type: true, venue: true, startDate: true, status: true } },
          user: { select: { id: true, name: true, email: true } },
        },
      });
      return sendSuccess(res, registrations, 'Registrations fetched');
    } catch (err) {
      return sendError(res, (err as Error).message);
    }
  }

  async checkInRegistration(req: AuthRequest, res: Response, _next: NextFunction) {
    try {
      const id = req.params.id as string;
      const registration = await prisma.registration.findUnique({ where: { id } });
      if (!registration) return sendError(res, 'Registration not found', 404);
      if (registration.checkedIn) return sendError(res, 'Already checked in', 409);
      const updated = await prisma.registration.update({
        where: { id },
        data: { checkedIn: true, checkedInAt: new Date() },
        include: {
          event: { select: { id: true, title: true, venue: true } },
          user: { select: { id: true, name: true, email: true } },
        },
      });
      return sendSuccess(res, updated, 'Check-in successful');
    } catch (err) {
      return sendError(res, (err as Error).message);
    }
  }

  async getLiveUpdates(_req: Request, res: Response, _next: NextFunction) {
    try {
      const updates = await prisma.liveUpdate.findMany({
        orderBy: { timestamp: 'desc' },
        include: {
          event: { select: { id: true, title: true } },
        },
      });
      return sendSuccess(res, updates, 'Live updates fetched');
    } catch (err) {
      return sendError(res, (err as Error).message);
    }
  }

  async deleteLiveUpdate(req: AuthRequest, res: Response, _next: NextFunction) {
    try {
      const id = req.params.id as string;
      await prisma.liveUpdate.delete({ where: { id } });
      return sendSuccess(res, null, 'Live update deleted');
    } catch (err) {
      return sendError(res, (err as Error).message);
    }
  }

  async deleteUser(req: AuthRequest, res: Response, _next: NextFunction) {
    try {
      const id = req.params.id as string;
      const target = await prisma.user.findUnique({ where: { id }, select: { role: true } });
      if (!target) return sendError(res, 'User not found', 404);
      if (target.role === 'admin') return sendError(res, 'Cannot delete an admin', 403);
      await prisma.registration.deleteMany({ where: { userId: id } });
      await prisma.announcement.deleteMany({ where: { createdBy: id } });
      await prisma.event.deleteMany({ where: { createdBy: id } });
      await prisma.user.delete({ where: { id } });
      return sendSuccess(res, null, 'User deleted');
    } catch (err) {
      return sendError(res, (err as Error).message);
    }
  }
}
