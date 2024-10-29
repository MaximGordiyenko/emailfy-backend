import express from 'express';
import morgan from "morgan";
import cors from 'cors';
import cookieParser from "cookie-parser";

import 'dotenv/config';
import { corsOptions } from "./config/corsOptions.js";

import { credentials } from "./middleware/credential.middleware.js";
// import { ErrorMiddleware } from "./middleware/error.middleware.js";

import { createDatabase, sequelize } from './DB.js';
import { Token } from './models/token.model.js';
import { Account } from './models/account.model.js';

import accountRoutes from './routes/account.js';
import dashboardRoutes from './routes/dashboard.js';


const app = express();
app.use(morgan('dev'));

app.use(credentials);
app.use(cors(corsOptions));

app.use(express.urlencoded({
  extended: false
}));

app.use(express.json());

app.use(cookieParser());

app.use('/api', accountRoutes);
app.use('/api', dashboardRoutes);

// app.use(ErrorMiddleware);

const setupAssociations = () => {
  Account.hasMany(Token, { foreignKey: 'userId', as: 'tokens' });
  Token.belongsTo(Account, { foreignKey: 'userId', as: 'account' });
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
    
    // Sync all models
    await sequelize.sync({ alter: true });
    console.log('Database synced successfully.');
    
    // Seed accounts
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
