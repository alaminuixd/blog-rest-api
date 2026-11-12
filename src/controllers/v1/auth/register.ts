/**
 * @copyright 2026 alamin khan
 * @license Apache-2.0
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
import Token from '@/models/token';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------
import type { Request, Response } from 'express';
import type { RegisterInput } from '@/validators/auth.validator';

/**
 * Register User
 * @route POST /api/v1/auth/register
 * @access Public
 */
const register = async (req: Request, res: Response): Promise<void> => {
  // Extract and type-cast the payload using the Zod inferred type
  const { email, password, role, firstName, lastName, socialLinks } =
    req.body as RegisterInput;

  if (role === 'admin' && !config.WHITELIST_ADMIN_MAILS.includes(email)) {
    res.status(403).json({
      code: 'AuthorizationError',
      message: 'You are not allowed to register as an admin',
    });

    logger.warn(
      `Unauthorized admin registration attempt: email ${email} is not whitelisted.`,
    );
    return;
  }

  try {
    const username = genUsername();

    const newUser = await User.create({
      username,
      email,
      password,
      role,
      firstName,
      lastName,
      socialLinks,
    });

    // Generate access token and refresh token for new user.
    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id); // Fixed: using refresh token generator

    // Store refresh token in db
    await Token.create({
      token: refreshToken,
      userId: newUser._id,
    });
    logger.info('Refresh token created for user', {
      userId: newUser._id,
      token: refreshToken,
    });

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
        firstName: newUser.firstName,
        lastName: newUser.lastName,
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
