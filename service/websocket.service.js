import { WebSocketServer } from 'ws';
import { Message } from '../models/message.model.js';
import { Chat } from '../models/chat.model.js';
import { bot } from './telegram.service.js';

let webSocket = null;
let activeChatSession = null;

export const initializeWebSocket = (server) => {
  const wss = new WebSocketServer({ server });
  
  wss.on('connection', (ws) => {
    console.log('🌐 Website connected');
    webSocket = ws;
    ws.send(JSON.stringify({ type: 'STATUS', message: 'Connected to server' }));
    
    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message);
        switch (data.type) {
          case 'CREATE_SESSION':
            if (activeChatSession) await closeChatSession(activeChatSession);
            activeChatSession = await Chat.create({ status: 'active' });
            ws.send(JSON.stringify({ type: 'SESSION_CREATED', sessionId: activeChatSession.id }));
            break;
          
          case 'MESSAGE':
            if (!activeChatSession) {
              return ws.send(JSON.stringify({ type: 'ERROR', message: 'No active chat session' }));
            }
            await Message.create({ content: data.message, source: 'website', chatId: activeChatSession.id });
            await bot.api.sendMessage(process.env.TELEGRAM_CHAT_ID, data.message);
            break;
          
          case 'CLOSE_SESSION':
            if (activeChatSession) {
              await closeChatSession(activeChatSession);
              activeChatSession = null;
            }
            break;
        }
      } catch (error) {
        console.error('⚠️ Error processing WebSocket message:', error);
      }
    });
    
    ws.on('close', async () => {
      console.log('🔌 Website disconnected');
      if (activeChatSession) {
        await closeChatSession(activeChatSession);
        activeChatSession = null;
      }
      webSocket = null;
    });
  });
}

async function closeChatSession(session) {
  await session.update({ status: 'closed', closedAt: new Date() });
}

export { webSocket, activeChatSession };
