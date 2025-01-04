import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import {
  signUpAccount,
  signInAccount,
  authRefreshToken,
  authLogout,
  getAccountInformation,
  getAccountStatus,
  getAudienceStatus,
} from '../controllers/account.controller.js';

const router = express.Router();

router.post('/register', signUpAccount);
router.post('/login', signInAccount);
router.post('/refresh', authRefreshToken);
router.post('/logout', authLogout);

router.get('/auth/account-info', authenticateToken, getAccountInformation);
router.get('/auth/account-status', authenticateToken, getAccountStatus);
router.get('/auth/audience-status', authenticateToken, getAudienceStatus);

export default router;
