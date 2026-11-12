/**
 * @copyright 2026 Alamin Khan
 * @license Apache-2.0
 */

// -----------------------------------------------------------------------------
// Node Modules
// -----------------------------------------------------------------------------
import bcrypt from 'bcrypt';

// -----------------------------------------------------------------------------
// Custom Modules
// -----------------------------------------------------------------------------
import { logger } from '@/lib/winston';
import config from '@/config';
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';
import User from '@/models/user';
import Token from '@/models/token';

// -----------------------------------------------------------------------------
// TYpes
// -----------------------------------------------------------------------------
import type { Request, Response } from 'express';
import type { LoginInput } from '@/validators/auth.validator';

/**
 * Login User
 * @route POST /api/v1/auth/login
 * @access Public
 */
const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as LoginInput;

    // Find user and explicitly select password
    const user = await User.findOne({ email })
      .select('username email password role')
      .lean() // Tells Mongoose to return a plain JavaScript object instead of a heavy Mongoose Document instance.
      .exec(); // Forces the query to run right away and returns a normal, standard JavaScript Promise (instead of Mongoose's special, custom promise-like object).

    if (!user) {
      res.status(401).json({
        code: 'AuthenticationError',
        message: 'Invalid email or password',
      });
      return;
    }

    // Compare submitted password with stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({
        code: 'AuthenticationError',
        message: 'Invalid email or password',
      });
      logger.warn(`Failed login attempt: invalid password for email ${email}`);
      return;
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Store refresh token in db
    await Token.create({
      token: refreshToken,
      userId: user._id,
    });
    logger.info('Refresh token created for user login', {
      userId: user._id,
    });

    // Set HTTP-only cookie for refresh token
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    // Final response
    res.status(200).json({
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
      },
      accessToken,
    });

    logger.info('User logged in successfully', {
      username: user.username,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({
      code: 'Server Error',
      message: 'Internal server error',
      error: err,
    });

    logger.error('Error during user login', err);
  }
};

export default login;
