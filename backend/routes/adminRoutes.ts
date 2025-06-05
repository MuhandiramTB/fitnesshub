import express from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  getAdminProfile,
  getDashboardStats,
  getRecentActivity,
  adminLogin,
  createAdmin,
} from '../controllers/adminController';

const router = express.Router();

// Public routes
router.post('/login', adminLogin);
router.post('/create', createAdmin); // For initial setup only

// Protected routes
router.get('/profile', authenticateToken, getAdminProfile);
router.get('/dashboard/stats', authenticateToken, getDashboardStats);
router.get('/dashboard/activity', authenticateToken, getRecentActivity);

export default router; 