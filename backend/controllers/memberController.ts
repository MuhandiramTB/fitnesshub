import { Request, Response } from 'express';
import { Prisma, User, Membership } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { createSystemLog } from './adminController';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { createMemberSchema, updateMemberSchema } from '../validations/memberValidation';

// Get all members
export const getMembers = async (req: Request, res: Response) => {
  try {
    const members = await prisma.user.findMany({
      where: { role: 'MEMBER' },
      include: {
        membership: {
          include: {
            package: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(members);
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create new member
export const createMember = async (req: Request, res: Response) => {
  try {
    const validatedData = createMemberSchema.parse(req.body);
    const { name, email, password, phoneNumber, packageId } = validatedData;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phoneNumber,
        role: 'MEMBER',
        membership: {
          create: {
            packageId,
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          },
        },
      },
      include: {
        membership: {
          include: {
            package: true,
          },
        },
      },
    });

    await createSystemLog(
      'MEMBERSHIP',
      'CREATE',
      `New member registered: ${name}`,
      user.id,
      req.user?.id
    );

    res.status(201).json(user);
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
    console.error('Error creating member:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update member
export const updateMember = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = updateMemberSchema.parse(req.body);

    // First update the user
    const user = await prisma.user.update({
      where: { id },
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phoneNumber: validatedData.phoneNumber,
      },
    });

    // Then update the membership status if provided
    if (validatedData.membershipStatus) {
      await prisma.membership.update({
        where: { userId: id },
        data: {
          status: validatedData.membershipStatus,
        },
      });
    }

    await createSystemLog(
      'MEMBERSHIP',
      'UPDATE',
      `Member updated: ${user.name}`,
      user.id,
      req.user?.id
    );

    // Fetch updated user with membership
    const updatedUser = await prisma.user.findUnique({
      where: { id },
      include: {
        membership: {
          include: {
            package: true,
          },
        },
      },
    });

    res.json(updatedUser);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors 
      });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return res.status(404).json({ message: 'Member not found' });
      }
    }
    console.error('Error updating member:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete member
export const deleteMember = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({ message: 'Member not found' });
    }

    await prisma.user.delete({
      where: { id },
    });

    await createSystemLog(
      'MEMBERSHIP',
      'DELETE',
      `Member deleted: ${user.name}`,
      user.id,
      req.user?.id
    );

    res.json({ message: 'Member deleted successfully' });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return res.status(404).json({ message: 'Member not found' });
      }
    }
    console.error('Error deleting member:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get member by ID
export const getMemberById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        membership: {
          include: {
            package: true,
          },
        },
        attendances: {
          orderBy: { checkIn: 'desc' },
          take: 10,
        },
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching member:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 