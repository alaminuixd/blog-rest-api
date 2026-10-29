import { Router } from 'express';

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

export default router;
