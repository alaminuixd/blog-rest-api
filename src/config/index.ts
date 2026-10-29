import dotenv from 'dotenv';

dotenv.config();

const config = {
  PORT: Number(process.env.PORT) || 3001,
  NODE_ENV: process.env.NODE_ENV,
  WHITELIST_ORIGINS: ['https://example.com', 'http://localhost:3002'],
  MONGO_URI: process.env.MONGO_URI,
};

export default config;
