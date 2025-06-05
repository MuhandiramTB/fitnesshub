import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get system logs
export const getSystemLogs = async (req: Request, res: Response) => {
  try {
    const {
      type,
      startDate,
      endDate,
      userId,
      adminId,
      page = 1,
      limit = 20,
    } = req.query;

    const where: any = {};
    if (type) {
      where.type = type;
    }
    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      };
    }
    if (userId) {
      where.userId = userId;
    }
    if (adminId) {
      where.adminId = adminId;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [logs, total] = await Promise.all([
      prisma.systemLog.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          admin: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.systemLog.count({ where }),
    ]);

    res.json({
      logs,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching system logs:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get log statistics
export const getLogStatistics = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    const where: any = {};
    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      };
    }

    const [
      totalLogs,
      logsByType,
      logsByAction,
      recentLogs,
    ] = await Promise.all([
      prisma.systemLog.count({ where }),
      prisma.systemLog.groupBy({
        by: ['type'],
        where,
        _count: true,
      }),
      prisma.systemLog.groupBy({
        by: ['action'],
        where,
        _count: true,
      }),
      prisma.systemLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          user: {
            select: {
              name: true,
            },
          },
          admin: {
            select: {
              name: true,
            },
          },
        },
      }),
    ]);

    res.json({
      totalLogs,
      logsByType,
      logsByAction,
      recentLogs,
    });
  } catch (error) {
    console.error('Error fetching log statistics:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 