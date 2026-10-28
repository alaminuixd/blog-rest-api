/**
 * @copyright 2026 Al Amin Khan
 * @license Apache-2.0
 */

/**
 * Import node modules
 */
import express from 'express';
import config from '@/config';
import cors from 'cors';

/**
 * Import TS types
 */
import type { CorsOptions } from 'cors';
// initialize app from express factory function
const app = express();

// Config cors options
const corsOptions: CorsOptions = {
  origin(origin, callback) {
    console.log(origin);
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

/**
 * @ routes
 */

app.get('/', (req, res) => {
  return res.status(200).json({ message: 'Hello world' });
});

app.listen(config.PORT, () => {
  console.log(`Listening to the PORT: http://localhost:${config.PORT}`);
});
