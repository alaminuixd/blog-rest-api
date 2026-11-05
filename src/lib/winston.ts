/**
 * @copyright 2026 alamin khan
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import winston from 'winston';

/**
 * Custom modules
 */
import config from '@/config';

const { combine, timestamp, json, errors, align, printf, colorize } =
  winston.format;

const transports: winston.transport[] = [];
/* const testTransport = new winston.transports.Console({
  format: combine(colorize({ all: true })),
});
const transportkeys = Object.keys(testTransport);
// console.log('Transport keys:', transportkeys);

const transportEntries = Object.entries(testTransport);
// console.log('Transport entries:', transportEntries);
console.log('class check starts');
console.dir(testTransport, { depth: null, colors: true });
console.log('class check ends');
 */
// Development: Pretty-printed, colorized console logs
if (config.NODE_ENV === 'development') {
  transports.push(
    new winston.transports.Console({
      format: combine(
        colorize({ all: true }),
        timestamp({ format: 'YYYY-MM-DD hh:mm:ss A' }),
        align(),
        printf(({ timestamp, level, message, ...meta }) => {
          const metaStr = Object.keys(meta).length
            ? `\n${JSON.stringify(meta, null, 2)}`
            : '';
          return `${timestamp} [${level.toUpperCase()}]: ${message}${metaStr}`;
        }),
      ),
    }),
  );
} else {
  // Production / Staging: Structured JSON output to Console for log aggregators
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
  silent: config.NODE_ENV === 'test', // Disable logging in the test environment
});
// console.log(transports);

export { logger };
