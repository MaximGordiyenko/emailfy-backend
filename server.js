import express from 'express';
import morgan from "morgan";
import cors from 'cors';
import cookieParser from "cookie-parser";

import 'dotenv/config';
import { corsOptions } from "./config/corsOptions.js";

import { credentials } from "./middleware/credential.middleware.js";

import { createDatabase, sequelize } from './DB.js';
import { Token } from './models/token.model.js';
import { Account } from './models/account.model.js';
import { Image } from './models/image.model.js';

import authRoutes from './routes/account.js';
import dashboardRoutes from './routes/dashboard.js';
import settingsRoutes from './routes/settings.js';

const app = express();
app.use(morgan('dev'));

app.use(credentials);
app.use(cors(corsOptions));

app.use(express.urlencoded({
  extended: false
}));

app.use(express.json());

app.use(cookieParser());

app.use('/api', authRoutes);
app.use('/api', dashboardRoutes);
app.use('/api', settingsRoutes);

const setupAssociations = () => {
  Account.hasMany(Token, {
    foreignKey: 'userId',
    as: 'tokens'
  });
  Token.belongsTo(Account, {
    foreignKey: 'userId',
    as: 'account'
  });
  Account.hasOne(Image, {
    foreignKey: 'accountId',
    as: 'profileImage'
  });
  Image.belongsTo(Account, {
    foreignKey: 'accountId',
    as: 'account'
  });
};

const initializeApp = async () => {
  try {
    // Create database if it doesn't exist
    await createDatabase();
    
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Setup associations
    setupAssociations();
    
    // Sync all models use { force: true } to drop and recreate tables
    await sequelize.sync({ alter: true });
    console.log('Database synced successfully.');
    
    // Seed accounts if need mock data
    // await seedAccounts();
    
    const PORT = process.env.SERVER_PORT || 4001;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start application:', error);
    process.exit(1);
  }
};

initializeApp();
