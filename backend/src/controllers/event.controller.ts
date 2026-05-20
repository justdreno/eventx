import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { sendSuccess, sendError } from '../utils';
import type { AuthRequest } from '../middlewares';

export class EventController {
  async getAll(req: Request, res: Response, _next: NextFunction) {
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
        orderBy: { startDate: 'asc' },
      });

      return sendSuccess(res, events, 'Events fetched successfully');
    } catch (err) {
      return sendError(res, (err as Error).message);
    }
  }

  async getById(req: Request, res: Response, _next: NextFunction) {
    try {
      const id = req.params.id as string;
      const event = await prisma.event.findUnique({ where: { id } });

      if (!event) {
        return sendError(res, 'Event not found', 404);
      }

      return sendSuccess(res, event, 'Event fetched successfully');
    } catch (err) {
      return sendError(res, (err as Error).message);
    }
  }

  async create(req: AuthRequest, res: Response, _next: NextFunction) {
    try {
      const data = req.body;
      const event = await prisma.event.create({
        data: { ...data, createdBy: req.userId! },
      });
      return sendSuccess(res, event, 'Event created successfully', 201);
    } catch (err) {
      return sendError(res, (err as Error).message);
    }
  }

  async update(req: AuthRequest, res: Response, _next: NextFunction) {
    try {
      const id = req.params.id as string;
      const event = await prisma.event.update({
        where: { id },
        data: req.body,
      });
      return sendSuccess(res, event, 'Event updated successfully');
    } catch (err) {
      return sendError(res, (err as Error).message);
    }
  }

  async delete(req: Request, res: Response, _next: NextFunction) {
    try {
      const id = req.params.id as string;
      await prisma.event.delete({ where: { id } });
      return sendSuccess(res, null, 'Event deleted successfully');
    } catch (err) {
      return sendError(res, (err as Error).message);
    }
  }
}
