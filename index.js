import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import pino from 'pino';

import { corsOptions } from "./config/corsOptions.js";
import { credentials } from "./middleware/credential.middleware.js";

import { createDatabase, sequelize } from './config/db.js';
import { modelAssociations } from './models/modelAssociations.js';

import 'dotenv/config';

import authRoutes from './routes/account.js';
import dashboardRoutes from './routes/dashboard.js';
import audienceRoutes from './routes/audience.js';
import campaignsRoutes from './routes/campaigns.js';
import settingsRoutes from './routes/settings.js';
import tagRoutes from './routes/tag.js';
import telegramRoutes from './routes/telegram.route.js';

const app = express();

// Logger
const logger = pino();

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

// Built-in middleware for json and url encoding
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Middleware for cookies
app.use(cookieParser());

// Routes
app.use('/', authRoutes);
app.use('/', dashboardRoutes);
app.use('/', audienceRoutes);
app.use('/', campaignsRoutes);
app.use('/', tagRoutes);
app.use('/', settingsRoutes);
app.use('/', telegramRoutes);

(async () => {
  try {
    // Create database if it doesn't exist
    await createDatabase();
    
    // Test database connection
    await sequelize.authenticate();
    
    // Setup associations
    modelAssociations();
    
    // Sync all models use { force: true } to drop and recreate tables
    await sequelize.sync({ alter: true });
    
    const PORT = process.env.SERVER_PORT || 4001;
    app.listen(PORT, () => {
      if (process.env.NODE_ENV !== 'production') {
        logger.info('Server started');
      }
    });
  } catch (error) {
    logger.error({ error }, '❌ Unable to start application');
    process.exit(1);
  }
})();
