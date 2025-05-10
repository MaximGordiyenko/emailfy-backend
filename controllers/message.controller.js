import { Message } from '../models/message.model.js';
import axios from 'axios';

export const postMessage = async (req, res) => {
  try {
    const { accountId, sessionId, message } = req.body;
    
    await Message.create({
      accountId,
      sessionId,
      fromRole: 'user',
      message,
    });
    
    await axios.post(`${process.env.TELEGRAM_BOT_URL}/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: process.env.TELEGRAM_CHAT_ID,
      text: `💬 New message from user ${sessionId}:\n${message}`,
    });
    
    res.sendStatus(200);
  } catch (error) {
    res.status().send(error);
  }
}

export const getMessage = async (req, res) => {
  try {
    const { sessionId } = req.query;
    console.log('getMessage:', sessionId);
    
    const messages = await Message.findAll({
      where: { sessionId },
      order: [['createdAt', 'ASC']],
      attributes: ['fromRole', 'message', 'createdAt'],
    });
    
    console.log(messages);
    res.json(messages);
  } catch (error) {
    res.status().send(error);
  }
}

export const postWebhook = async (req, res) => {
  const msg = req.body.message;
  
  if (!msg || !msg.text || !msg.reply_to_message || !msg.reply_to_message.text) {
    return res.sendStatus(200);
  }
  
  // Extract session ID from original message sent by bot
  const originalText = msg.reply_to_message.text;
  const sessionIdMatch = originalText.match(/user (\S+):/); // Match UUID in: "💬 New message from user <uuid>:"
  if (!sessionIdMatch) {
    console.log('[Webhook] No session ID found in reply_to_message');
    return res.sendStatus(200);
  }
  
  const sessionId = sessionIdMatch[1];
  const replyText = msg.text;
  
  try {
    await Message.create({
      sessionId,
      fromRole: 'admin',
      message: replyText,
    });
    
    console.log(`[Webhook] Stored reply for ${sessionId}: ${replyText}`);
  } catch (err) {
    console.error('[Webhook] Failed to store message:', err);
  }
  
  res.sendStatus(200);
}
