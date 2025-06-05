import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        phoneNumber: true,
        weight: true,
        targetWeight: true,
        workoutFrequency: true,
        achievements: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { name, targetWeight, workoutFrequency } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.userId },
      data: {
        name,
        targetWeight: targetWeight ? parseFloat(targetWeight) : undefined,
        workoutFrequency: workoutFrequency ? parseInt(workoutFrequency) : undefined
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        phoneNumber: true,
        weight: true,
        targetWeight: true,
        workoutFrequency: true,
        achievements: true
      }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 