import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { createSystemLog } from './adminController';

const prisma = new PrismaClient();

// Get all services
export const getServices = async (req: Request, res: Response) => {
  try {
    const services = await prisma.service.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create new service
export const createService = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      price,
      billingCycle,
      category,
      capacity,
    } = req.body;

    const service = await prisma.service.create({
      data: {
        name,
        description,
        price,
        billingCycle,
        category,
        capacity,
      },
    });

    await createSystemLog(
      'SERVICE',
      'CREATE',
      `New service created: ${name}`,
      undefined,
      req.user?.userId
    );

    res.status(201).json(service);
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update service
export const updateService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      billingCycle,
      category,
      capacity,
      isActive,
    } = req.body;

    const service = await prisma.service.update({
      where: { id },
      data: {
        name,
        description,
        price,
        billingCycle,
        category,
        capacity,
        isActive,
      },
    });

    await createSystemLog(
      'SERVICE',
      'UPDATE',
      `Service updated: ${name}`,
      undefined,
      req.user?.userId
    );

    res.json(service);
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete service
export const deleteService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const service = await prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    await prisma.service.delete({
      where: { id },
    });

    await createSystemLog(
      'SERVICE',
      'DELETE',
      `Service deleted: ${service.name}`,
      undefined,
      req.user?.userId
    );

    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get service by ID
export const getServiceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        bookings: {
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

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json(service);
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 