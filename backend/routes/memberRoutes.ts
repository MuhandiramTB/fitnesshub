import express from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  getMembers,
  createMember,
  updateMember,
  deleteMember,
  getMemberById,
} from '../controllers/memberController';

const router = express.Router();

// All routes are protected and require admin authentication
router.use(authenticateToken);

// Get all members
router.get('/', getMembers);

// Get member by ID
router.get('/:id', getMemberById);

// Create new member
router.post('/', createMember);

// Update member
router.put('/:id', updateMember);

// Delete member
router.delete('/:id', deleteMember);

export default router; 