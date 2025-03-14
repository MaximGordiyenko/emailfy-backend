import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { getAIResponse } from '../controllers/campaigns.controller.js';

const router = express.Router();

router.post('/auth/campaigns/builder/chat', authenticateToken, getAIResponse );

export default router;
