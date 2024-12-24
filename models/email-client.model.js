import { DataTypes } from 'sequelize';
import { sequelize } from '../DB.js';
import { Account } from './account.model.js';

export const EmailClient = sequelize.define('EmailClient', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  accountId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    references: {
      model: Account,
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
  },
  zipCode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
  },
  unsubscribed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  unsubscribedReason: {
    type: DataTypes.ENUM(
      'Irrelevant content',
      'Spam or unsolicited emails',
      'Not interested',
      'Too many emails',
      'Poor quality content',
    ),
    allowNull: true, // Allow null for non-unsubscribed clients
  },
  tagStatus: {
    type: DataTypes.ENUM(
      'passive',
      'active',
      'block',
      'wait',
    ),
    allowNull: false,
  },
});
