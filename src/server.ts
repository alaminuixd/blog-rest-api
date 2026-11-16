/**
 * @copyright 2026 Al Amin Khan
 * @license Apache-2.0
 */

// -----------------------------------------------------------------------------
// Node Modules
// -----------------------------------------------------------------------------
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';
import type { Server } from 'http';

// -----------------------------------------------------------------------------
// Custom modules
// -----------------------------------------------------------------------------
import config from '@/config';
import { corsOptions } from '@/config/cors.config';
import rateLimiter from '@/lib/express-rate-limit';
import v1Routes from '@/routes/v1';
import { connectToDatabase, disconnectFromDatabase } from '@/lib/mongosh';
import { logger } from '@/lib/winston';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------
import type { CorsOptions } from 'cors';

// Initialize app from express factory function
const app = express();

// -----------------------------------------------------------------------------
// Middlewares
// -----------------------------------------------------------------------------
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression({ threshold: 1024 }));
app.use(helmet());
app.use(rateLimiter);

// Keep a reference to the HTTP server instance for graceful shutdown
let server: Server;

// -----------------------------------------------------------------------------
// Graceful Shutdown Handler
// -----------------------------------------------------------------------------
const handleServerShutdown = async (signal: string) => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);

  try {
    // 1. Stop accepting new HTTP requests
    if (server) {
      await new Promise<void>((resolve, reject) => {
        server.close((err) => {
          if (err) reject(err);
          else resolve();
        });
      });
      logger.info('HTTP server closed successfully.');
    }

    // 2. Disconnect from database
    await disconnectFromDatabase();
    logger.info('Database connection closed successfully.');

    logger.info('Server shutdown complete.');
    process.exit(0); // Normal exit
  } catch (err) {
    logger.error('Error during graceful shutdown:', err);
    process.exit(1); // Exit with failure
  }
};

// Listen for termination signals from OS / Docker / PM2
process.on('SIGTERM', () => handleServerShutdown('SIGTERM'));
process.on('SIGINT', () => handleServerShutdown('SIGINT'));

// -----------------------------------------------------------------------------
// Database Connection & Server Startup
// -----------------------------------------------------------------------------
(async () => {
  try {
    // 1. Establish database connection first
    await connectToDatabase();

    // 2. Mount API v1 routers
    app.use('/api/v1', v1Routes);

    // 3. Start HTTP server listener
    server = app.listen(config.PORT, () => {
      logger.info(
        `Server is running at http://localhost:${config.PORT} [${config.NODE_ENV}]`,
      );
    });

    // 4. Handle runtime server errors (e.g., EADDRINUSE)
    server.on('error', (err: NodeJS.ErrnoException) => {
      logger.error('Server runtime error encountered:', err);
      if (err.code === 'EADDRINUSE') {
        logger.error(`Port ${config.PORT} is already in use.`);
      }
      process.exit(1);
    });
  } catch (err) {
    logger.error('Failed to initialize and start the server:', err);
    process.exit(1); // Always fail fast if startup dependencies (DB) fail
  }
})();
