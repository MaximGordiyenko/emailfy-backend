import express from 'express';

import { authenticateToken } from '../middleware/auth.middleware.js';
import {
  getTotalEmailAnalytics,
  getCampaignStatisticsByEmailID,
  getClientEmails,
  getTotalUnsubscribedEmailStatistic
} from '../controllers/dashboard.controller.js';

const router = express.Router();

router.get('/auth/dashboard/totalEmailAnalytics', authenticateToken, getTotalEmailAnalytics);
router.get('/auth/dashboard/clientEmails', authenticateToken, getClientEmails);
router.get('/auth/dashboard/campaignStatisticsByEmailID/:id', authenticateToken, getCampaignStatisticsByEmailID);
router.get('/auth/dashboard/totalUnsubscribedEmailStatistic', authenticateToken, getTotalUnsubscribedEmailStatistic);

export default router;
