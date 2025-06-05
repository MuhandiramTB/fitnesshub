import express from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  getPackages,
  createPackage,
  updatePackage,
  deletePackage,
  getPackageById,
} from '../controllers/packageController';

const router = express.Router();

// All routes are protected and require admin authentication
router.use(authenticateToken);

// Get all packages
router.get('/', getPackages);

// Get package by ID
router.get('/:id', getPackageById);

// Create new package
router.post('/', createPackage);

// Update package
router.put('/:id', updatePackage);

// Delete package
router.delete('/:id', deletePackage);

export default router; 