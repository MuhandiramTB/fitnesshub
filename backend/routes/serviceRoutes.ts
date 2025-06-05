import express from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  getServices,
  createService,
  updateService,
  deleteService,
  getServiceById,
} from '../controllers/serviceController';

const router = express.Router();

// All routes are protected and require admin authentication
router.use(authenticateToken);

// Get all services
router.get('/', getServices);

// Get service by ID
router.get('/:id', getServiceById);

// Create new service
router.post('/', createService);

// Update service
router.put('/:id', updateService);

// Delete service
router.delete('/:id', deleteService);

export default router; 