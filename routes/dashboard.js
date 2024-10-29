import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { dashboardData } from '../controllers/dashboard.controller.js';

const router = express.Router();

router.get('/auth/dashboard', authenticateToken, dashboardData);

export default router;
