/**
 * @copyright 2026 alamin khan
 * @listens Apache-2.0
 */

/**
 * Node modules
 */
import crypto from 'crypto';
/**
 * Generate random username (e.g. user-abc-123)
 */
export const genUsername = (): string => {
  const randomChars = crypto.randomBytes(4).toString('hex');
  return `user-${randomChars}`;
};
