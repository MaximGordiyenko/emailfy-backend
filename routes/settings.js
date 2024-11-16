import express from 'express';
import multer from 'multer';

import { authenticateToken } from '../middleware/auth.middleware.js';
import { uploadFile, getProfileImage, updateAccountInformation } from '../controllers/settings.controller.js';

const upload = multer({ storage: multer.memoryStorage() }); // Use memory storage for multer

const router = express.Router();

router.post('/settings/upload', upload.single('file'), uploadFile);
router.post('/settings/update', authenticateToken, updateAccountInformation);

router.get('/settings/images', getProfileImage);

export default router;
