/**
 * @copyright 2026 alamin khan
 * @license Apache-2.0
 */

import winston from 'winston';
import config from '@/config';

const { combine, timestamp, json, errors, align, printf, colorize, ms } =
  winston.format;

const transports: winston.transport[] = [];

// Development: Pretty-printed, colorized console logs with timing
if (config.NODE_ENV === 'development') {
  transports.push(
    new winston.transports.Console({
      format: combine(
        colorize({ all: true }),
        timestamp({ format: 'YYYY-MM-DD hh:mm:ss A' }),
        ms(), // Tracks time elapsed since previous log
        align(),
        printf(({ timestamp, level, message, ms, ...meta }) => {
          const metaStr = Object.keys(meta).length
            ? `\n${JSON.stringify(meta, null, 2)}`
            : '';
          return `${timestamp} [${level}] (${ms}): ${message}${metaStr}`;
        }),
      ),
    }),
  );
} else {
  // Production / Staging: Structured JSON output for log aggregators
  transports.push(
    new winston.transports.Console({
      format: combine(timestamp(), errors({ stack: true }), json()),
    }),
  );
}

// Create a logger instance using Winston
const logger = winston.createLogger({
  level: config.LOG_LEVEL || 'info',
  format: combine(timestamp(), errors({ stack: true }), json()),
  transports,
  // Automatically log unhandled application errors and promise rejections
  exceptionHandlers: new winston.transports.Console({
    format: combine(timestamp(), errors({ stack: true }), json()),
  }),
  rejectionHandlers: new winston.transports.Console({
    format: combine(timestamp(), errors({ stack: true }), json()),
  }),
  silent: config.NODE_ENV === 'test',
});

export { logger };
