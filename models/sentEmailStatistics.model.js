import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import { Campaign } from './campaign.model.js';
import { EmailClient } from './email-client.model.js';

export const SentEmailsStatistic = sequelize.define('SentEmailsStatistic', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  emailId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    references: {
      model: EmailClient,
      key: 'id',
    },
  },
  campaignId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    references: {
      model: Campaign,
      key: 'id',
    },
  },
  delivered: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  opened: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  clicked: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  bounced: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});
