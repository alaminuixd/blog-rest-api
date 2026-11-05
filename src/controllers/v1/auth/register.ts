/**
 * @copyright 2026 alamin khan
 * @listens Apache-2.0
 */

/**
 * Node modules
 */

/**
 * custom modules
 */
import { logger } from '@/lib/winston';

/**
 * Models
 */

/**
 * Types
 */
import { Request, Response, NextFunction } from 'express';

const register = async (req: Request, res: Response): Promise<void> => {
  try {
    res.status(201).json({
      message: 'New user created',
    });
  } catch (err) {
    res.status(500).json({
      code: 'Server Error',
      message: 'Internal server error',
      error: err,
    });

    logger.error('Error during user registration', err);
  }
};

export default register;
