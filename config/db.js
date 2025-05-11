import { Sequelize } from "sequelize";
import dotenv from 'dotenv';
dotenv.config();

// Check for required environment variable
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('❌ DATABASE_URL environment variable is not set');
  process.exit(1);
}

// Log connection string format (without sensitive data)
const maskedConnectionString = connectionString.replace(/:[^@]+@/, ':****@');
console.log('📡 Attempting to connect to:', maskedConnectionString);

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

export const sequelize = new Sequelize(connectionString, {
  ...commonOptions,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    },
  },
});

export const createDatabase = async () => {
  console.log('✅ Database connection established successfully.');
};
