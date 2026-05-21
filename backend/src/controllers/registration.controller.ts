import { Response, NextFunction } from 'express';
import crypto from 'crypto';
import prisma from '../lib/prisma';
import { sendSuccess, sendError } from '../utils';
import type { AuthRequest } from '../middlewares';

export class RegistrationController {
  async create(req: AuthRequest, res: Response, _next: NextFunction) {
    try {
      const { eventId, ticketType } = req.body;
      const userId = req.userId!;

      if (!eventId) {
        return sendError(res, 'Event ID is required', 400);
      }

      const event = await prisma.event.findUnique({ where: { id: eventId } });
      if (!event) {
        return sendError(res, 'Event not found', 404);
      }

      const existing = await prisma.registration.findFirst({
        where: { eventId, userId },
      });
      if (existing) {
        return sendError(res, 'You are already registered for this event', 409);
      }

      const registration = await prisma.registration.create({
        data: {
          eventId,
          userId,
          ticketType: ticketType || 'attendee',
          qrCode: crypto.randomUUID(),
        },
        include: {
          event: {
            select: { id: true, title: true, type: true, venue: true, startDate: true, endDate: true, status: true },
          },
        },
      });

      return sendSuccess(res, registration, 'Registration successful', 201);
    } catch (err) {
      return sendError(res, (err as Error).message);
    }
  }

  async getMyRegistrations(req: AuthRequest, res: Response, _next: NextFunction) {
    try {
      const registrations = await prisma.registration.findMany({
        where: { userId: req.userId },
        include: {
          event: {
            select: { id: true, title: true, type: true, venue: true, startDate: true, endDate: true, status: true },
          },
        },
        orderBy: { registeredAt: 'desc' },
      });

      return sendSuccess(res, registrations, 'Registrations fetched');
    } catch (err) {
      return sendError(res, (err as Error).message);
    }
  }

  async checkInByQr(req: AuthRequest, res: Response, _next: NextFunction) {
    try {
      const qrCode = req.params.qrCode as string;
      const registration = await prisma.registration.findUnique({ where: { qrCode } });
      if (!registration) {
        return sendError(res, 'Invalid QR code — no registration found', 404);
      }
      if (registration.checkedIn) {
        return sendError(res, 'Already checked in', 409);
      }
      const updated = await prisma.registration.update({
        where: { id: registration.id },
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

  async checkIn(req: AuthRequest, res: Response, _next: NextFunction) {
    try {
      const id = req.params.id as string;
      const registration = await prisma.registration.findUnique({ where: { id } });

      if (!registration) {
        return sendError(res, 'Registration not found', 404);
      }

      if (registration.checkedIn) {
        return sendError(res, 'Already checked in', 409);
      }

      const updated = await prisma.registration.update({
        where: { id },
        data: { checkedIn: true, checkedInAt: new Date() },
      });

      return sendSuccess(res, updated, 'Check-in successful');
    } catch (err) {
      return sendError(res, (err as Error).message);
    }
  }
}
