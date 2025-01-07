import { DataTypes } from 'sequelize';
import { sequelize } from '../DB.js';

export const AudienceGroup = sequelize.define('AudienceGroup', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contacts: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  segments: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  created: {
    type: DataTypes.DATE,
    allowNull: false
  },
  modified: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  timestamps: false // Disable automatic management of timestamps
});
