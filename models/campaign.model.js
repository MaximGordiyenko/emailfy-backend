import { DataTypes } from 'sequelize';
import { sequelize } from '../DB.js';
import { EmailClient } from './email-client.model.js';

export const Campaign = sequelize.define('Campaign', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  emailId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    references: {
      model: EmailClient,
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false
  },
  senderName: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'none'
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false
  }
});
