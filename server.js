import express from 'express';
import morgan from "morgan";
import cors from 'cors';
import cookieParser from "cookie-parser";

import 'dotenv/config';
import { corsOptions } from "./config/corsOptions.js";

import { credentials } from "./middleware/credential.middleware.js";

import { createDatabase, sequelize } from './DB.js';
import { modelAssociations } from './models/modelAssociations.js';

import authRoutes from './routes/account.js';
import dashboardRoutes from './routes/dashboard.js';
import audienceRoutes from './routes/audience.js';
import campaignsRoutes from './routes/campaigns.js';
import settingsRoutes from './routes/settings.js';
import tagRoutes from './routes/tag.js';

import {
  generateRandomClientEmails,
  generateRandomCampaigns,
  generateRandomAccounts,
  generateRandomSentEmailsStatistic,
  generateRandomAudienceGroups,
} from './helpers/seeds.js';

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
app.use('/api', audienceRoutes);
app.use('/api', campaignsRoutes);
app.use('/api', tagRoutes);
app.use('/api', settingsRoutes);

const initializeApp = async () => {
  try {
    // Create database if it doesn't exist
    await createDatabase();
    
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Setup associations
    modelAssociations()
    
    // Sync all models use { force: true } to drop and recreate tables
    await sequelize.sync({ alter: true });
    console.log('Database synced successfully.');
    
    // Seeds if need mock data
    // await generateRandomAccounts(100);
    
    // await generateRandomClientEmails(2000);
    // await generateRandomCampaigns(2000);
    // await generateRandomSentEmailsStatistic();
    // await generateRandomAudienceGroups();
    
    const PORT = process.env.SERVER_PORT || 4001;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start application:', error);
    process.exit(1);
  }
};

initializeApp().then(r => r);
