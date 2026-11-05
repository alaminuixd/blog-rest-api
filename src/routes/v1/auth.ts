/**
 * @copyright 2026 alamin khan
 * @listens Apache-2.0
 */

/**
 * Node modules
 */
import { Router } from 'express';

/**
 * Controllers
 */
import registerController from '@/controllers/v1/auth/register';

/**
 * Middlewares
 */

/**
 * Models
 */
const router = Router();

router.post('/register', registerController);

export default router;
