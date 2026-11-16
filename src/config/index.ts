/**
 * @copyright 2026 Alamin Khan
 * @license Apache-2.0
 */

// -----------------------------------------------------------------------------
// Node Modules
// -----------------------------------------------------------------------------
import dotenv from 'dotenv';

// -----------------------------------------------------------------------------
// Custom Modules
// -----------------------------------------------------------------------------
import { zConfigSchema } from '@/validators/z-config.schema';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------
import type ms from 'ms';

/**
 * Load environment variables from .env file into process.env
 */
dotenv.config();

/**
 * Validate environment variables against the Zod schema at startup.
 * Exits the process immediately if required variables are missing or invalid.
 */
const parseResult = zConfigSchema.safeParse(process.env);

if (!parseResult.success) {
  console.error('❌ Invalid environment variables configuration:');
  console.error(JSON.stringify(parseResult.error.format(), null, 2));
  process.exit(1);
}

const env = parseResult.data;

/**
 * Application-wide immutable configuration object.
 */
const config = {
  PORT: Number(env.PORT),
  NODE_ENV: env.NODE_ENV,
  MONGO_URI: env.MONGO_URI,
  LOG_LEVEL: env.LOG_LEVEL,
  JWT_ACCESS_SECRET: env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: env.JWT_REFRESH_SECRET,
  ACCESS_TOKEN_EXPIRY: env.ACCESS_TOKEN_EXPIRY as ms.StringValue,
  REFRESH_TOKEN_EXPIRY: env.REFRESH_TOKEN_EXPIRY as ms.StringValue,
  WHITELIST_ORIGINS: [
    'https://example.com',
    'http://localhost:3002',
  ] as readonly string[],
  WHITELIST_ADMIN_MAILS: [
    'alaminuixd@gmail.com',
    'a9bd.com@gmail.com',
  ] as readonly string[],
} as const;

// as const: Nowhere in the application can these values be reassigned
export default config;
