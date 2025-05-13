import axios from 'axios';

export const registerTelegramWebhook = async () => {
  try {
    const url = `https://emailfy-backend-production.up.railway.app/webhook`;
    const response = await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/setWebhook`, { url });
    console.log('Webhook successfully registered', response.data);
  } catch (error) {
    console.error('Failed to register webhook:', error);
  }
};
