import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import {
  signUpAccount,
  signInAccount,
  authRefreshToken,
  authLogout,
  getAccountInformation
} from '../controllers/account.controller.js';

const router = express.Router();

router.post('/register', signUpAccount);
router.post('/login', signInAccount);
router.post('/refresh', authRefreshToken);
router.post('/logout', authLogout);

router.get('/auth/account-info', authenticateToken, getAccountInformation);

export default router;
