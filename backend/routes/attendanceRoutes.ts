import express from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  getCurrentAttendance,
  checkInMember,
  checkOutMember,
  getAttendanceHistory,
} from '../controllers/attendanceController';

const router = express.Router();

// All routes are protected and require admin authentication
router.use(authenticateToken);

// Get current attendance
router.get('/current', getCurrentAttendance);

// Get attendance history
router.get('/history', getAttendanceHistory);

// Check in member
router.post('/check-in', checkInMember);

// Check out member
router.put('/check-out/:id', checkOutMember);

export default router; 