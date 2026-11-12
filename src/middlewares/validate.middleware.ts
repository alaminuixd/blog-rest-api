/**
 * @copyright 2026 alamin khan
 * @license Apache-2.0
 */

// -----------------------------------------------------------------------------
// Node Modules
// -----------------------------------------------------------------------------
import type { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';

export const validate = (schema: ZodObject<any>) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      // Parse and strip out undefined fields, applying defaults
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          code: 'ValidationError',
          message: 'Invalid input data',
          errors: error.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
        return;
      }
      next(error);
    }
  };
};
