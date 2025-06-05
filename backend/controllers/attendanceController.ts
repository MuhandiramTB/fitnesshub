import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { createSystemLog } from './adminController';

const prisma = new PrismaClient();

// Get current attendance
export const getCurrentAttendance = async (req: Request, res: Response) => {
  try {
    const attendance = await prisma.attendance.findMany({
      where: {
        checkOut: null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            membership: {
              include: {
                package: true,
              },
            },
          },
        },
      },
      orderBy: { checkIn: 'desc' },
    });
    res.json(attendance);
  } catch (error) {
    console.error('Error fetching current attendance:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Check in member
export const checkInMember = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        membership: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'Member not found' });
    }

    if (!user.membership || user.membership.status !== 'ACTIVE') {
      return res.status(400).json({ message: 'Member does not have an active membership' });
    }

    const existingCheckIn = await prisma.attendance.findFirst({
      where: {
        userId,
        checkOut: null,
      },
    });

    if (existingCheckIn) {
      return res.status(400).json({ message: 'Member is already checked in' });
    }

    const attendance = await prisma.attendance.create({
      data: {
        userId,
        checkIn: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            membership: {
              include: {
                package: true,
              },
            },
          },
        },
      },
    });

    await createSystemLog(
      'ATTENDANCE',
      'CHECK_IN',
      `Member checked in: ${user.name}`,
      userId,
      req.user?.id
    );

    res.status(201).json(attendance);
  } catch (error) {
    console.error('Error checking in member:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Check out member
export const checkOutMember = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const attendance = await prisma.attendance.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    if (attendance.checkOut) {
      return res.status(400).json({ message: 'Member is already checked out' });
    }

    const updatedAttendance = await prisma.attendance.update({
      where: { id },
      data: {
        checkOut: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            membership: {
              include: {
                package: true,
              },
            },
          },
        },
      },
    });

    await createSystemLog(
      'ATTENDANCE',
      'CHECK_OUT',
      `Member checked out: ${attendance.user.name}`,
      attendance.user.id,
      req.user?.id
    );

    res.json(updatedAttendance);
  } catch (error) {
    console.error('Error checking out member:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get attendance history
export const getAttendanceHistory = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, userId } = req.query;

    const where: any = {};
    if (startDate && endDate) {
      where.checkIn = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      };
    }
    if (userId) {
      where.userId = userId;
    }

    const attendance = await prisma.attendance.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { checkIn: 'desc' },
    });

    res.json(attendance);
  } catch (error) {
    console.error('Error fetching attendance history:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 