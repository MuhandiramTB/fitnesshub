import { z } from 'zod';

export const createMemberSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(6),
  phoneNumber: z.string().min(10).max(15),
  packageId: z.string().uuid(),
});

export const updateMemberSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  phoneNumber: z.string().min(10).max(15).optional(),
  membershipStatus: z.enum(['ACTIVE', 'EXPIRED', 'CANCELLED', 'SUSPENDED']).optional(),
}); 