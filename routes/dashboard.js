import express from 'express';

import { authenticateToken } from '../middleware/auth.middleware.js';
import { getDashboardDate } from '../controllers/dashboard.controller.js';

const router = express.Router();

router.get('/auth/dashboard', authenticateToken, getDashboardDate);

export default router;
