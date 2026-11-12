/**
 * @copyright 2026 alamin khan
 * @listens Apache-2.0
 */

// -----------------------------------------------------------------------------
// Node Modules
// -----------------------------------------------------------------------------
import { Router } from 'express';

// -----------------------------------------------------------------------------
// Custom Modules
// -----------------------------------------------------------------------------
import authRoute from '@/routes/v1/auth';

/**
 * Create instance of the Router
 */
const router = Router();

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
/**
 * Route Chain:
 * /api/v1/auth
 * app.use('/api/v1', v1Routes); > router.use('/auth', authRoute);
 */
