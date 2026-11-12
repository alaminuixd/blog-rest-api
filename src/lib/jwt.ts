/**
 * @copyright 2026 alamin khan
 * @listens Apache-2.0
 */
// -----------------------------------------------------------------------------
// Node Modules
// -----------------------------------------------------------------------------
import jwt from 'jsonwebtoken';

// -----------------------------------------------------------------------------
// Custom Modules
// -----------------------------------------------------------------------------
import config from '@/config';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------
import { Types } from 'mongoose';

/**
 * Generates a secure Access Token for a user.
 * Note: jsonwebtoken natively accepts human-readable string values
 * (like '15m' or '7d') for the expiresIn option.
 * But we still use the 'ms' package for Type assertion in TS (see config file).
 */
export const generateAccessToken = (userId: Types.ObjectId): string => {
  return jwt.sign(
    { userId: userId.toString() }, // 1. Plain object payload
    config.JWT_ACCESS_SECRET, // 2. Secret Key (Fixes the mix-up)
    {
      expiresIn: config.ACCESS_TOKEN_EXPIRY, // 3. Accepts the time string
      subject: 'accessToken',
    },
  );
};

/**
 * Refresh Token
 */
export const generateRefreshToken = (userId: Types.ObjectId): string => {
  return jwt.sign(
    { userId: userId.toString() }, // 1. Plain object payload
    config.JWT_REFRESH_SECRET, // 2. Secret Key (Fixes the mix-up)
    {
      expiresIn: config.REFRESH_TOKEN_EXPIRY, // 3. Accepts the time string
      subject: 'refreshToken',
    },
  );
};

/**
 * Verify access token
 */
export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, config.JWT_ACCESS_SECRET);
};
/**
 * Verify refresh token
 */
export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, config.JWT_REFRESH_SECRET);
};
