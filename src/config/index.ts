import dotenv from 'dotenv';

dotenv.config();

const config = {
  PORT: Number(process.env.PORT) || 3001,
  NODE_ENV: process.env.NODE_ENV,
  WHITELIST_ORIGINS: ['https://example.com', 'http://localhost:3002'],
  MONGO_URI: process.env.MONGO_URI,
  LOG_LEVEL: process.env.LOG_LEVEL || 'info', // Set the default logging level to 'info'
};

export default config;
