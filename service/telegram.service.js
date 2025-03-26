import { Bot } from 'grammy';
import { Message } from '../models/message.model.js';
import { webSocket, activeChatSession } from './websocket.service.js';

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN);

export const initializeTelegramBot = () => {
  bot.on('message', async (ctx) => {
    try {
      if (activeChatSession) {
        await Message.create({
          content: ctx.message.text,
          source: 'telegram',
          chatId: activeChatSession.id
        });
        
        if (webSocket && webSocket.readyState === 1) { // 1 = WebSocket.OPEN
          webSocket.send(JSON.stringify({ type: 'MESSAGE', source: 'telegram', message: ctx.message.text }));
        }
      }
    } catch (error) {
      console.error('⚠️ Error processing Telegram message:', error);
    }
  });
  
  bot.start().then(() => console.log('🤖 Telegram bot started.'));
}

export { bot };
