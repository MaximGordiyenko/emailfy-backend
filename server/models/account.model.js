import { DataTypes } from 'sequelize';
import { sequelize } from '../DB.js';

export const Account = sequelize.define('Account', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
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
    unique: true,
    allowNull: false
  },
  remember: {
    type: DataTypes.BOOLEAN,
  }
});
