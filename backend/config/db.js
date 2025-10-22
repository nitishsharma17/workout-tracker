const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

// Use clear environment variable names. Ensure DB_PORT is a number.
const dbName = process.env.DB_NAME || 'workoutdb';
const dbUser = process.env.DB_USER || 'postgres';
const dbPass = process.env.DB_PASS || 'nitish1121';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = Number(process.env.DB_PORT) || 54321;

const sequelize = new Sequelize(dbName, dbUser, dbPass, {
  host: dbHost,
  port: dbPort,
  dialect: 'postgres',
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('🔌 PostgreSQL Database connected successfully');
  } catch (error) {
    console.error('Unable to connect to the database:', error.message || error);
    // Rethrow so caller can handle process termination or retries
    throw error;
  }
};

module.exports = { sequelize, connectDB };
