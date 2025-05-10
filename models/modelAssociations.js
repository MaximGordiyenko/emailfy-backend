import { Account } from './account.model.js';
import { Token } from './token.model.js';
import { Image } from './image.model.js';
import { EmailClient } from './email-client.model.js';
import { Campaign } from './campaign.model.js';
import { SentEmailsStatistic } from './sentEmailStatistics.model.js';
import { Chat } from './chat.model.js';

export const modelAssociations = () => {
  // Account and Related Models
  Account.hasMany(Token, { foreignKey: 'accountId' });
  Token.belongsTo(Account, { foreignKey: 'accountId' });
  
  Account.hasOne(Image, { foreignKey: 'accountId' });
  Image.belongsTo(Account, { foreignKey: 'accountId' });
  
  Account.hasMany(EmailClient, { foreignKey: 'accountId' });
  EmailClient.belongsTo(Account, { foreignKey: 'accountId' });

// EmailClient and Campaign
  EmailClient.hasMany(Campaign, { foreignKey: 'emailId' });
  Campaign.belongsTo(EmailClient, { foreignKey: 'emailId' });

// Campaign and EmailStatistics (adjusted if necessary)
  EmailClient.hasMany(SentEmailsStatistic, { foreignKey: 'emailId' });
  SentEmailsStatistic.belongsTo(EmailClient, { foreignKey: 'emailId' });
  
  Campaign.hasMany(SentEmailsStatistic, { foreignKey: 'campaignId' }); // Allow multiple stats per campaign
  SentEmailsStatistic.belongsTo(Campaign, { foreignKey: 'campaignId' });
  
  Account.hasMany(Chat, { foreignKey: 'accountId' });
  Chat.belongsTo(Account, { foreignKey: 'accountId' });
};
