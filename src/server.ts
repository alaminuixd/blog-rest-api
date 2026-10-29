/**
 * @copyright 2026 Al Amin Khan
 * @license Apache-2.0
 */

/**
 * Import node modules
 */
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';
/**
 * custom modules
 */
import config from '@/config';
import rateLimiter from '@/lib/express-rate-limit';
import v1Routes from '@/routes/v1';
import { connectTODatabase, disconnectFromDatabase } from '@/lib/mongosh';

/**
 * Import TS types
 */
import type { CorsOptions } from 'cors';

// initialize app from express factory function
const app = express();

// Config cors options
const corsOptions: CorsOptions = {
  origin(origin, callback) {
    // origin: Requesting frontend URL supplied by the browser
    // callback: Function used to return the result (takes: error, allow Boolean)
    console.log(`The request origin is: ${origin}`);
    if (
      config.NODE_ENV === 'development' ||
      !origin ||
      config.WHITELIST_ORIGINS.includes(origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error(`CORS Error: ${origin} is not allowed.`), false);
      console.log(`CORS Error: ${origin} is not allowed.`);
    }
  },
};

/**
 * @ middlewares
 */
app.use(cors(corsOptions));
// Enable JSON request parsing
app.use(express.json());
// Parse incoming URL-encoded client form data (populates req.body)
app.use(express.urlencoded({ extended: true }));
// Parse cookies attached to incoming client requests (populates req.cookies)
app.use(cookieParser());
// Compress HTTP response from the server for better performance (here, only for larger than 1KB)
app.use(
  compression({
    threshold: 1024,
  }),
);
// Secure the app by setting various HTTP security headers (protects against common vulnerabilities like XSS and clickjacking)
app.use(helmet());
// Prevents excessive/ suspicious API requests.
app.use(rateLimiter);

/**
 * @ routes & server startup
 */
(async () => {
  try {
    // DB connection
    await connectTODatabase();
    // 1. Mount API v1 routers
    app.use('/api/v1', v1Routes);

    // 2. Start HTTP server listener
    const server = app.listen(config.PORT, () => {
      console.log(`Listening to the PORT: http://localhost:${config.PORT}`);
    });

    // 3. Catch startup errors (like port already in use)
    server.on('error', (err) => {
      console.error('Failed to start the server:', err);
      process.exit(1);
    });
  } catch (err) {
    console.error('failed to start the server', err);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
})();

/**
 * Henales server shutdown gracefully by disconnecting from the database.
 *
 * - Attempt to disconnect from the database before shutting down the server.
 * - Logs a success message if the disconnection is successful.
 * - If an error occurs during disconnection, it is logged to the console.
 * - Exits the process with status code '0' (indicating a successful shutdown.)
 */

const handleServerShutdown = async () => {
  try {
    await disconnectFromDatabase();
    console.log('The server is shutted down.');
    process.exit(0);
  } catch (err) {
    console.log('Error during server shutdown.', err);
  }
};

/**
 * Listen for the termination signals ('SIGTERM' and 'SIGINT')
 *
 * - SIGINT (Signal Interrupt): This is triggered when you manually stop the server in your terminal by pressing Ctrl + C.
 * - SIGTERM (Signal Terminate): This is a polite "shutdown request" sent by your operating system, Docker, or a cloud platform (like Render or AWS) when it wants to stop your application (e.g., during a deployment or server restart).
 */
process.on('SIGTERM', handleServerShutdown);
process.on('SIGINT', handleServerShutdown);
