import express from 'express';
import morgan from "morgan";
import cors from 'cors';
import cookieParser from "cookie-parser";

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
app.use(morgan('dev'));

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

app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from Railway backend!' });
});

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
    console.log('✅ Database synced successfully.');
    
    const PORT = process.env.SERVER_PORT || 4001;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (error) {
    console.error('❌ Unable to start application:', error);
    process.exit(1);
  }
})();
