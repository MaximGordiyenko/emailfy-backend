import express from 'express';
import { signInAccount, getAllAccounts } from '../controllers/account.controller.js';

const router = express.Router();

router.post('/api/account', signInAccount);

router.get('/api/account', getAllAccounts);

export default router;
