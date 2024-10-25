import { Sequelize } from "sequelize";
import 'dotenv/config';

export const sequelize = new Sequelize(process.env.PSQL_NAME, process.env.PSQL_USER, process.env.PSQL_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

export const createDatabase = async () => {
  const sequelize = new Sequelize('postgres', process.env.PSQL_USER, process.env.PSQL_PASSWORD, {
    host: process.env.PSQL_HOST,
    port: process.env.PSQL_PORT,
    dialect: 'postgres',
    logging: false
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
