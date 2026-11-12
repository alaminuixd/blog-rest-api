/**
 * @copyright 2026 alamin khan
 * @license Apache-2.0
 */
// -----------------------------------------------------------------------------
// Node Modules
// -----------------------------------------------------------------------------
import { z } from 'zod';

export const registerSchema = z.object({
  username: z
    .string({ message: 'Username is required' })
    .min(3, "Username can't be less than 3 characters")
    .max(20, 'Username must be less than 20 characters')
    .trim(),
  email: z
    .string()
    .min(1, 'Email is required')
    .max(254, 'Max input 254 characters exceeded')
    .refine((val) => /^[a-zA-Z0-9.]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val), {
      message: 'Please fill a valid email address',
    })
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters long')
    .max(254, 'Max input 254 characters exceeded'),
  role: z.enum(['admin', 'user']).default('user'),
  firstName: z
    .string()
    .trim()
    .max(20, 'First name must be less than 20 characters')
    .optional(),
  lastName: z
    .string()
    .trim()
    .max(20, 'Last name must be less than 20 characters')
    .optional(),
  socialLinks: z
    .object({
      website: z
        .string()
        .max(100)
        .refine((val) => {
          if (!val || val === '') return true;
          // Standard URL validation regex pattern
          return /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/.test(
            val,
          );
        })
        .optional()
        .or(z.literal('')),
      facebook: z.string().max(100).optional(),
      instagram: z.string().max(100).optional(),
      linkedin: z.string().max(100).optional(),
      x: z.string().max(100).optional(),
      youtube: z.string().max(100).optional(),
    })
    .optional(),
});

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

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
