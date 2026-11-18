/**
 * @copyright 2026 Alamin Khan
 * @license Apache-2.0
 */
// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

import type { Options as RateLimitOptions } from 'express-rate-limit';

/**
 * Centralized rate-limiting configuration options
 */
export const rateLimitOptions: Partial<RateLimitOptions> = {
  windowMs: 60000, // 1 minute
  limit: 59, // Max 59 requests per IP in 1 minute
  standardHeaders: 'draft-8', // Modern standardized headers
  legacyHeaders: false, // Disable X-RateLimit-* headers
  message: {
    error: 'Too many requests exceeds the max time',
  },
};
