import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { getGroupAudienceList } from '../controllers/audience.controller.js';

const router = express.Router();

router.get('/auth/audience/group_list', authenticateToken, getGroupAudienceList);

export default router;
