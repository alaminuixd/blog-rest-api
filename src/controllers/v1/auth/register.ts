/**
 * @copyright 2026 alamin khan
 * @listens Apache-2.0
 */

// -----------------------------------------------------------------------------
// Node Modules
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Custom modules
// -----------------------------------------------------------------------------
import { logger } from '@/lib/winston';
import { genUsername } from '@/utils';
import config from '@/config';
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';

// -----------------------------------------------------------------------------
// Models
// -----------------------------------------------------------------------------
import User from '@/models/user';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

import { Request, Response } from 'express';
import type { IUser } from '@/models/user';

type UserData = Pick<IUser, 'email' | 'password' | 'role'>;

const register = async (req: Request, res: Response): Promise<void> => {
  // Extract and type-cast the payload for user registration
  const { email, password, role } = req.body as UserData;

  try {
    const username = genUsername();

    const newUser = await User.create({
      username,
      email,
      password,
    });

    // Generate access token and refresh token for new user.
    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateAccessToken(newUser._id);

    // Set res.cookie and pass tokens
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    // Final response
    res.status(201).json({
      user: {
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
      accessToken,
    });

    logger.info('User registered successfully', {
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
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
