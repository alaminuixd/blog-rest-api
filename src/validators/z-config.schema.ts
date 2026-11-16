/**
 * @copyright 2026 Alamin Khan
 * @license Apache-2.0
 */

// -----------------------------------------------------------------------------
// Node Modules
// -----------------------------------------------------------------------------
import { z } from 'zod';

/**
 * Environment variables validation schema
 */
export const zConfigSchema = z.object({
  PORT: z.string().default('5000'),
  MONGO_URI: z.url({ error: 'MONGO_URI must be a valid URL' }),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  LOG_LEVEL: z.string().default('info'), // <-- Handled by Zod default
  JWT_ACCESS_SECRET: z.string().min(1, 'JWT_ACCESS_SECRET is required'),
  JWT_REFRESH_SECRET: z.string().min(1, 'JWT_REFRESH_SECRET is required'),
  ACCESS_TOKEN_EXPIRY: z.string().min(1, 'ACCESS_TOKEN_EXPIRY is required'),
  REFRESH_TOKEN_EXPIRY: z.string().min(1, 'REFRESH_TOKEN_EXPIRY is required'),
});

export type ConfigSchemaType = z.infer<typeof zConfigSchema>;
