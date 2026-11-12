/**
 * @copyright 2026 alamin khan
 * @license Apache-2.0
 */

// -----------------------------------------------------------------------------
// Node Modules
// -----------------------------------------------------------------------------
import { Router } from 'express';

// -----------------------------------------------------------------------------
// Controller
// -----------------------------------------------------------------------------
import registerController from '@/controllers/v1/auth/register';
import loginController from '@/controllers/v1/auth/login';
import refreshTokenController from '@/controllers/v1/auth/refresh-token';

// -----------------------------------------------------------------------------
// Middleware validator
// -----------------------------------------------------------------------------
import { validate } from '@/middlewares/validate.middleware';
import { registerSchema } from '@/validators/auth.validator';
import { loginSchema } from '@/validators/auth.validator';

// -----------------------------------------------------------------------------
// Router
// -----------------------------------------------------------------------------
const router = Router();

/**
 * Bind the final route /register
 * @route POST /api/v1/auth/register
 * @access Public
 */
router.post('/register', validate(registerSchema), registerController);

/**
 * Bind the final route /login
 * @route POST /api/v1/auth/login
 * @access Public
 */

router.post('/login', validate(loginSchema), loginController);

/**
 * Refresh token final route /refresh-token
 * @route POST /api/v1/auth/refresh-token
 * @access Private
 */
router.post('/refresh-token', refreshTokenController);

export default router;
