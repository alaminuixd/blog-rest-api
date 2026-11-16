/**
 * @copyright 2026 alamin khan
 * @license Apache-2.0
 */
// -----------------------------------------------------------------------------
// Node Modules
// -----------------------------------------------------------------------------
import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .max(254, 'Max input 254 characters exceeded')
    .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: 'Please fill a valid email address',
    })
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(1, 'Password is required')
    .max(254, 'Max input 254 characters exceeded'),
});

export type LoginInput = z.infer<typeof loginSchema>;
