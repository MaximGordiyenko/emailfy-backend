import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const Chat = sequelize.define('Chat', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  status: {
    type: DataTypes.ENUM('active', 'closed'),
    defaultValue: 'active'
  },
  startedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  closedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true
});
