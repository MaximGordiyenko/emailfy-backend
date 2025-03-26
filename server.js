import express from 'express';
import morgan from "morgan";
import cors from 'cors';
import cookieParser from "cookie-parser";

import 'dotenv/config';
import { corsOptions } from "./config/corsOptions.js";

import { credentials } from "./middleware/credential.middleware.js";

// import { createDatabase, sequelize } from './DB.js';
import { modelAssociations } from './models/modelAssociations.js';

import authRoutes from './routes/account.js';
import dashboardRoutes from './routes/dashboard.js';
import audienceRoutes from './routes/audience.js';
import campaignsRoutes from './routes/campaigns.js';
import settingsRoutes from './routes/settings.js';
import tagRoutes from './routes/tag.js';
import http from 'http';
import { initializeWebSocket } from './service/websocket.service.js';
import { initializeTelegramBot } from './service/telegram.service.js';

import { createDatabase, sequelize } from './config/db.js';

const app = express();

app.use(morgan('dev'));
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use('/api', authRoutes);
app.use('/api', dashboardRoutes);
app.use('/api', audienceRoutes);
app.use('/api', campaignsRoutes);
app.use('/api', tagRoutes);
app.use('/api', settingsRoutes);

const server = http.createServer(app);
initializeWebSocket(server);
initializeTelegramBot();

(async () => {
  try {
    // Create database if it doesn't exist
    await createDatabase();
    
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    
    // Setup associations
    modelAssociations();
    
    // Sync all models use { force: true } to drop and recreate tables
    await sequelize.sync({ alter: true });
    console.log('✅ Database synced successfully.');
    
    const PORT = process.env.SERVER_PORT || 4001;
    server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (error) {
    console.error('❌ Unable to start application:', error);
    process.exit(1);
  }
})();
