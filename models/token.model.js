import { DataTypes } from 'sequelize';
import { sequelize } from '../DB.js';
import { Account } from './account.model.js';

export const Token = sequelize.define('Token', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
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
