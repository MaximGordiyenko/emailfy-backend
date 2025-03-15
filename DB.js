import { Sequelize } from "sequelize";
import dotenv from 'dotenv';
dotenv.config();

// Define common options
const commonOptions = {
  dialect: "postgres",
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

// Check if running in a production environment (Render)
const isProduction = process.env.NODE_ENV === "production";
console.log(`Running in ${isProduction ? "Production" : "Development"} mode`);

// Use DATABASE_URL in production (Render) or local env variables for development
const connectionString = isProduction
  ? process.env.PSQL_URL?.trim()
  : `postgres://${process.env.PSQL_USER}:${process.env.PSQL_PASSWORD}@${process.env.PSQL_HOST}:${process.env.PSQL_PORT}/${process.env.PSQL_NAME}`;

if (!connectionString) {
  throw new Error("Database connection string is undefined. Check environment variables.");
}

export const sequelize = new Sequelize(connectionString, {
  ...commonOptions,
  dialectOptions: isProduction
    ? {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Required for Render's PostgreSQL
      },
    }
    : {},
});

export const createDatabase = async () => {
  const sequelize = new Sequelize(connectionString, {
    ...commonOptions,
    dialectOptions: isProduction
      ? {
        ssl: {
          require: true,
          rejectUnauthorized: false, // Required for Render's PostgreSQL
        },
      }
      : {},
  });
  
  try {
    // Check if database exists
    const query = `SELECT 1 FROM pg_database WHERE datname = '${process.env.PSQL_NAME}'`;
    const result = await sequelize.query(query);
    
    if (result[0].length === 0) {
      // Create database if it doesn't exist
      await sequelize.query(`CREATE DATABASE ${process.env.PSQL_NAME}`);
      console.log(`Database ${process.env.PSQL_NAME} created.`);
    }
  } catch (error) {
    console.error('Error creating database:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
};
