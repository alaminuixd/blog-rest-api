/**
 * @copyright 2026 Alamin Khan
 * @license Apache-2.0
 */
// -----------------------------------------------------------------------------
// Node Modules
// -----------------------------------------------------------------------------
import dotenv from 'dotenv';

// -----------------------------------------------------------------------------
// Typses
// -----------------------------------------------------------------------------
import type ms from 'ms';

dotenv.config();

const config = {
  PORT: Number(process.env.PORT) || 3001,
  NODE_ENV: process.env.NODE_ENV,
  WHITELIST_ORIGINS: ['https://example.com', 'http://localhost:3002'],
  MONGO_URI: process.env.MONGO_URI,
  LOG_LEVEL: process.env.LOG_LEVEL || 'info', // Set the default logging level to 'info'
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY! as ms.StringValue,
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY! as ms.StringValue,
  WHITELIST_ADMIN_MAILS: ['alaminuixd@gmail.com', 'a9bd.com@gmail.com'],
};

export default config;
