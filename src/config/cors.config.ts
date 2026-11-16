/**
 * @copyright 2026 Al Amin Khan
 * @license Apache-2.0
 */

// -----------------------------------------------------------------------------
// Custom Modules
// -----------------------------------------------------------------------------
import config from '@/config';
import { logger } from '@/lib/winston';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------
import type { CorsOptions } from 'cors';

/**
 * Centralized CORS configuration options
 */
export const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    // Only log request origins in development to prevent production log bloat
    if (config.NODE_ENV === 'development') {
      logger.debug(`Incoming request origin: ${origin}`);
    }

    if (
      config.NODE_ENV === 'development' ||
      !origin ||
      config.WHITELIST_ORIGINS.includes(origin)
    ) {
      callback(null, true);
    } else {
      const errorMessage = `CORS Error: ${origin} is not allowed.`;
      logger.warn(errorMessage);
      callback(new Error(errorMessage), false);
    }
  },
};
