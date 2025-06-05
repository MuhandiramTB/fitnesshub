import { Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
    }
  }
}

// Input validation schemas
const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const createAdminSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(6),
});

// Get admin profile
export const getAdminProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const adminId = req.user.id;
    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        lastLogin: true,
      },
    });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.json(admin);
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get dashboard statistics
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const [
      totalMembers,
      activeMembers,
      totalRevenue,
      currentAttendance,
      newMembers,
      activeServices,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.membership.count({
        where: { status: 'ACTIVE' },
      }),
      prisma.payment.aggregate({
        where: {
          status: 'COMPLETED',
          createdAt: {
            gte: new Date(new Date().setDate(1)), // First day of current month
          },
        },
        _sum: {
          amount: true,
        },
      }),
      prisma.attendance.count({
        where: {
          checkOut: null,
        },
      }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setDate(1)), // First day of current month
          },
        },
      }),
      prisma.service.count({
        where: { isActive: true },
      }),
    ]);

    res.json({
      totalMembers,
      activeMembers,
      totalRevenue: totalRevenue._sum.amount || 0,
      currentAttendance,
      newMembers,
      activeServices,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get recent activity
export const getRecentActivity = async (req: Request, res: Response) => {
  try {
    const logs = await prisma.systemLog.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
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
    });

    res.json(logs);
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create system log
export const createSystemLog = async (
  type: 'ATTENDANCE' | 'MEMBERSHIP' | 'PAYMENT' | 'SYSTEM' | 'PACKAGE' | 'SERVICE',
  action: string,
  description: string,
  userId?: string,
  adminId?: string,
  metadata?: any
) => {
  try {
    await prisma.systemLog.create({
      data: {
        type,
        action,
        description,
        userId,
        adminId,
        metadata,
      },
    });
  } catch (error) {
    console.error('Error creating system log:', error);
  }
};

// Update admin last login
export const updateLastLogin = async (adminId: string) => {
  try {
    await prisma.admin.update({
      where: { id: adminId },
      data: { lastLogin: new Date() },
    });
  } catch (error) {
    console.error('Error updating last login:', error);
  }
};

// Admin login
export const adminLogin = async (req: Request, res: Response) => {
  try {
    const validatedData = adminLoginSchema.parse(req.body);
    const { email, password } = validatedData;

    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, admin.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    const token = jwt.sign(
      { id: admin.id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    await updateLastLogin(admin.id);
    await createSystemLog('SYSTEM', 'LOGIN', 'Admin logged in', undefined, admin.id);

    res.json({
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors 
      });
    }
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    console.error('Error during admin login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create admin (for initial setup)
export const createAdmin = async (req: Request, res: Response) => {
  try {
    const validatedData = createAdminSchema.parse(req.body);
    const { name, email, password } = validatedData;

    const existingAdmin = await prisma.admin.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.admin.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      message: 'Admin created successfully',
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors 
      });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return res.status(400).json({ message: 'Email already registered' });
      }
    }
    console.error('Error creating admin:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 