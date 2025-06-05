import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { createSystemLog } from './adminController';

const prisma = new PrismaClient();

// Get all packages
export const getPackages = async (req: Request, res: Response) => {
  try {
    const packages = await prisma.package.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(packages);
  } catch (error) {
    console.error('Error fetching packages:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create new package
export const createPackage = async (req: Request, res: Response) => {
  try {
    const { name, description, price, duration, features } = req.body;

    const package_ = await prisma.package.create({
      data: {
        name,
        description,
        price,
        duration,
        features,
      },
    });

    await createSystemLog(
      'PACKAGE',
      'CREATE',
      `New package created: ${name}`,
      undefined,
      req.user?.userId
    );

    res.status(201).json(package_);
  } catch (error) {
    console.error('Error creating package:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update package
export const updatePackage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, price, duration, features, isActive } = req.body;

    const package_ = await prisma.package.update({
      where: { id },
      data: {
        name,
        description,
        price,
        duration,
        features,
        isActive,
      },
    });

    await createSystemLog(
      'PACKAGE',
      'UPDATE',
      `Package updated: ${name}`,
      undefined,
      req.user?.userId
    );

    res.json(package_);
  } catch (error) {
    console.error('Error updating package:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete package
export const deletePackage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const package_ = await prisma.package.findUnique({
      where: { id },
    });

    if (!package_) {
      return res.status(404).json({ message: 'Package not found' });
    }

    await prisma.package.delete({
      where: { id },
    });

    await createSystemLog(
      'PACKAGE',
      'DELETE',
      `Package deleted: ${package_.name}`,
      undefined,
      req.user?.userId
    );

    res.json({ message: 'Package deleted successfully' });
  } catch (error) {
    console.error('Error deleting package:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get package by ID
export const getPackageById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const package_ = await prisma.package.findUnique({
      where: { id },
      include: {
        memberships: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!package_) {
      return res.status(404).json({ message: 'Package not found' });
    }

    res.json(package_);
  } catch (error) {
    console.error('Error fetching package:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 