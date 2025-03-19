import express from 'express';
import multer from 'multer';

import { authenticateToken } from '../middleware/auth.middleware.js';
import {
  uploadFile,
  getProfileImage,
  updateAccountInformation,
  getCountries,
  generateClientEmails,
  generateEmailCampaigns,
  generateEmailsStatistic
} from '../controllers/settings.controller.js';

const upload = multer({ storage: multer.memoryStorage() }); // Use memory storage for multer

const router = express.Router();

router.post('/settings/upload', upload.single('file'), uploadFile);
router.post('/settings/update', authenticateToken, updateAccountInformation);
router.post('/settings/user-info/client-emails', authenticateToken, generateClientEmails);
router.post('/settings/user-info/client-campaigns', authenticateToken, generateEmailCampaigns);
router.post('/settings/user-info/client-statistic', authenticateToken, generateEmailsStatistic);

router.get('/settings/images', getProfileImage);
router.get('/auth/settings/company/countries', getCountries);

export default router;
