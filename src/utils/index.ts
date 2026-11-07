/**
 * @copyright 2026 alamin khan
 * @listens Apache-2.0
 */

/**
 * Node modules
 */

/**
 * Generate random username (e.g. user-abc-123)
 */

export const genUsername = (): string => {
  const prefix = 'user-';
  const randomChars = Math.random().toString(36).slice(2);
  const username = prefix + randomChars;
  return username;
};
