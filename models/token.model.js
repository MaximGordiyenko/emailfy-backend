import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import { Account } from './account.model.js';

export const Token = sequelize.define('Token', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false
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
  expiryDate: {
    type: DataTypes.DATE,
    allowNull: true,
  }
});
