/**
 * @copyright 2026 alamin khan
 * @listens Apache-2.0
 */

/**
 * Node modules
 */
import { Router } from 'express';

/**
 * Create instance of the Router
 */
const router = Router();

/**
 * Routes
 */
import authRoute from '@/routes/v1/auth';

/**
 * Root router
 */
router.get('/', (req, res) => {
  return res.status(200).json({
    message: 'API is live',
    status: 'ok',
    version: '1.0.0',
    docs: 'https://github.com/alaminuixd/blog-rest-api',
    timestamp: new Date().toISOString(),
  });
});

router.use('/auth', authRoute);

export default router;
