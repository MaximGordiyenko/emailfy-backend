import { DataTypes } from 'sequelize';
import { sequelize } from '../DB.js';

export const Account = sequelize.define('Account', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'user'
  },
  product: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  billing: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      isDecimal: true,
    },
  },
  createdAt: {
    type: DataTypes.DATEONLY, // Stores only the date in YYYY-MM-DD format
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATEONLY, // Stores only the date in YYYY-MM-DD format
    defaultValue: DataTypes.NOW,
  },
});
