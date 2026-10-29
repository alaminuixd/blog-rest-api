/**
 * @ Node modules
 */
import mongoose from 'mongoose';

/**
 * @ Custom modules
 */
import config from '@/config';
/**
 * @ Types
 */
import type { ConnectOptions } from 'mongoose';
/**
 * Client options
 */
const clientOptions: ConnectOptions = {
  dbName: 'blog-db',
  appName: 'Blog API',
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  },
};

/**
 * Establish a connection the MongoDB dtabase using Mongoose.
 * If an error occurs during the connection process, it throws and error
 * with a descriptive message.
 *
 * - Uses `MONGO_URI` as the connection string.
 * - `clientOptions` contains additional configuration for Mongoose.
 * - Errors are properly handled and rethrown for beter debugging.
 */

export const connectTODatabase = async () => {
  if (!config.MONGO_URI) {
    throw new Error('No MONGO URI is found in the config');
  }

  try {
    await mongoose.connect(config.MONGO_URI, clientOptions);
    console.log('MongoDB database connection success', {
      uri: config.MONGO_URI,
      options: clientOptions,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Error connecting database';
    console.log(errorMessage);
  }
};

/**
 * Disconnects from the MongoDB database using Mongoose.
 *
 * This function attempts to disconnect from the database asynchronously.
 * If the disconnection is successful, a success message is logged.
 * If an error occurs, it is either re-thrown as a new Error (if it's an instance of Error) or logged to teh console.
 */

export const disconnectFromDatabase = async () => {
  try {
    await mongoose.disconnect();
    console.log('Disconnected from the database successfully.', {
      uri: config.MONGO_URI,
      options: clientOptions,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Error while disconnecting from database';
    console.log(errorMessage);
  }
};
