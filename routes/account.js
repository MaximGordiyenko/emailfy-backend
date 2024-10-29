import express from 'express';
import { signUpAccount, signInAccount, authRefreshToken, authLogout } from '../controllers/account.controller.js';

const router = express.Router();

router.post('/register', signUpAccount);
router.post('/login', signInAccount);
router.post('/refresh', authRefreshToken);
router.post('/logout', authLogout);

export default router;
