import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import adminRoutes from '../routes/adminRoutes';
import packageRoutes from '../routes/packageRoutes';
import memberRoutes from '../routes/memberRoutes';
import serviceRoutes from '../routes/serviceRoutes';
import attendanceRoutes from '../routes/attendanceRoutes';
import logRoutes from '../routes/logRoutes';
import authRoutes from '../routes/authRoutes';
import userRoutes from './routes/userRoutes';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/packages', packageRoutes);
app.use('/api/admin/members', memberRoutes);
app.use('/api/admin/services', serviceRoutes);
app.use('/api/admin/attendance', attendanceRoutes);
app.use('/api/admin/logs', logRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 