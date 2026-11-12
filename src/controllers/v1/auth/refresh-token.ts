/**
 * @copyright 2026 Alamin Khan
 * @license Apache-2.0
 */

// -----------------------------------------------------------------------------
// Node Modules
// -----------------------------------------------------------------------------
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

// -----------------------------------------------------------------------------
// Custom modules
// -----------------------------------------------------------------------------
import { logger } from '@/lib/winston';
import { verifyRefreshToken, generateAccessToken } from '@/lib/jwt';

// -----------------------------------------------------------------------------
// Models
// -----------------------------------------------------------------------------
import Token from '@/models/token';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------
import { Request, Response } from 'express';

/**
 * Refresh token
 * @route POST /api/v1/auth/refresh-token
 * @access Private
 */
const refreshToken = async (req: Request, res: Response) => {
  const tokenCookie = req.cookies.refreshToken as string;

  if (!tokenCookie) {
    res.status(401).json({
      code: 'AuthenticationError',
      message: 'No refresh token provided',
    });
    return;
  }

  console.log('refresh token cookie: ', tokenCookie);

  try {
    const tokenExists = await Token.exists({ token: tokenCookie });

    if (!tokenExists) {
      res.status(403).json({
        code: 'AuthenticationError',
        message: 'Invalid refresh token',
      });
      return;
    }

    // Verify refresh token and type payload correctly as string
    const jwtPayload = verifyRefreshToken(tokenCookie) as {
      userId: string;
    };

    // Generate a new access token
    const accessToken = generateAccessToken(jwtPayload.userId as any);

    res.status(200).json({ accessToken });
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      res.status(401).json({
        code: 'AuthenticationError',
        message: 'Refresh token expired, please login again',
      });
      return;
    }

    if (err instanceof JsonWebTokenError) {
      res.status(401).json({
        code: 'AuthenticationError',
        message: 'Invalid refresh token',
      });
      return;
    }

    logger.error('Error during refresh token:', err);

    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: err,
    });
  }
};

export default refreshToken;
