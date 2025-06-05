import express from 'express';
import { register, login, googleAuth } from '../src/controllers/authController';

const router = express.Router();

// Auth routes
router.post('/register', register);
router.post('/login', login);
router.get('/google', googleAuth);

export default router; 