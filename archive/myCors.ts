import type { Request, Response, NextFunction } from 'express';

type OriginCallback = (err: Error | null, allow?: boolean) => void;
type OriginChecker = (
  // This origin is taken from the main Cors Options origin. {origini?}
  origin: string | undefined,
  callback: OriginCallback,
) => void;

interface MyCorsOptions {
  origin?: string | string[] | OriginChecker;
}

export const myCors = (options: MyCorsOptions = {}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const requestOrigin = (req.headers['myorigin'] || req.headers['origin']) as
      | string
      | undefined;

    const allowedOrigin = options.origin;

    // Case 1: Allow all if no origin option passed
    if (!allowedOrigin) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      return next();
    }

    // Case 2: String origin
    if (typeof allowedOrigin === 'string') {
      // allowedOrigin === '*': (The Wildcard / Open Door):
      // requestOrigin === allowedOrigin: (The Exact Match / Security Shield):
      if (allowedOrigin === '*' || requestOrigin === allowedOrigin) {
        res.setHeader(
          'Access-Control-Allow-Origin',
          requestOrigin || allowedOrigin,
        );
        return next();
      }
      return res
        .status(403)
        .json({ error: 'CORS policy violation: Origin not allowed.' });
    }

    // Case 3: Array of allowed origins
    if (Array.isArray(allowedOrigin)) {
      // We don't need to add string check for array items because
      // We woud never be able to use add other type rather than string in the `MyCorsOptions { string[] }`
      // TypeScript guarantees type safety at compile-time and keeps our hot path fast.
      if (requestOrigin && allowedOrigin.includes(requestOrigin)) {
        res.setHeader('Access-Control-Allow-Origin', requestOrigin);
        return next();
      }
      return res
        .status(403)
        .json({ error: 'CORS policy violation: Origin not allowed.' });
    }

    // Case 4: Dynamic function / callback checker
    if (typeof allowedOrigin === 'function') {
      allowedOrigin(requestOrigin, (err, allow) => {
        if (err) return next(err);
        if (allow) {
          if (requestOrigin) {
            res.setHeader('Access-Control-Allow-Origin', requestOrigin);
          }
          return next();
        }
        return res
          .status(403)
          .json({ error: 'CORS policy violation: Origin not allowed.' });
      });
      return; // Exit synchronous execution while callback resolves
    }
    // Safety next() return for unexpected users input for the origin.
    // In this case the execution will not be stopped but fall to the next route.
    return next();
  };
};

export const myCorsOptions: MyCorsOptions = {
  origin(
    myOrigin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ) {
    console.log(`myOrigin is: ${myOrigin}`);

    // Allow requests with no origin (e.g. mobile apps, curl) or specific allowed origins
    const allowedList = ['go', 'http://localhost:3000'];

    if (!myOrigin || allowedList.includes(myOrigin)) {
      callback(null, true);
    } else {
      callback(new Error(`${myOrigin} is not allowed by CORS policy.`), false);
    }
  },
};
