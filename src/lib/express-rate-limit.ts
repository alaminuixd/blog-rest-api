import { rateLimit } from 'express-rate-limit';

const rateLimiter = rateLimit({
  windowMs: 60000, // limited to 1 minute
  limit: 60, // max request per IP in 1 minute
  standardHeaders: 'draft-8', // Sends modern, standardized rate-limit info in the response headers (telling the client how many requests they have left).
  legacyHeaders: false, // Turns off the old, outdated rate-limit headers (X-RateLimit-*)
  message: {
    error: 'Too many requests exceeds the max time.',
  },
});

export default rateLimiter;
