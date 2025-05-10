import express from 'express';
import { postMessage, getMessage, postWebhook } from '../controllers/message.controller.js';

const router = express.Router();

router.post('/send', postMessage);
router.post('/webhook', postWebhook);
router.get('/messages', getMessage);

export default router;
