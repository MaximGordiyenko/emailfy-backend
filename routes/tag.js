import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { getEmailClientInfo, getTagsStatistic } from '../controllers/tag.controller.js';

const router = express.Router();

router.get('/auth/tags/emailClientInfo', authenticateToken, getEmailClientInfo);
router.get('/auth/tags/tagsStatistic', authenticateToken, getTagsStatistic);

export default router;
