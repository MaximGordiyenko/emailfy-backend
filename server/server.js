import express from 'express';
import morgan from "morgan";
import cors from 'cors';
import cookieParser from "cookie-parser";
import 'dotenv/config';
import { corsOptions } from "./config/corsOptions.js";
import { credentials } from "./middleware/credential.middleware.js";
import accountRoutes from './routes/account.js';
import { ErrorMiddleware } from "./middleware/error.middleware.js";
import { createDatabase, sequelize } from './DB.js';
import { seedAccounts } from './scripts/seeds/account.seed.js';

const app = express();
app.use(morgan('dev'));

app.use(credentials);
app.use(cors(corsOptions));

app.use(express.urlencoded({
  extended: false
}));

app.use(express.json());

app.use(cookieParser());

app.use(accountRoutes);

app.use(ErrorMiddleware);

const initializeApp = async () => {
  try {
    // Create database if it doesn't exist
    await createDatabase();
    
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Sync all models
    await sequelize.sync({ alter: true });
    console.log('Database synced successfully.');
    
    // Seed accounts
    await seedAccounts();
    
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
