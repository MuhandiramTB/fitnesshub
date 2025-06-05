import express from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  getSystemLogs,
  getLogStatistics,
} from '../controllers/logController';

const router = express.Router();

// All routes are protected and require admin authentication
router.use(authenticateToken);

// Get system logs with pagination and filters
router.get('/', getSystemLogs);

// Get log statistics
router.get('/statistics', getLogStatistics);

export default router; 