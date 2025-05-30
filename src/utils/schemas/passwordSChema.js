import { z } from 'zod';

export const passwordSchema = z.string()
  .min(5, 'Password must be at least 8 characters long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/\d/, 'Password must contain at least one number')
  .regex(/[\W_]/, 'Password must contain at least one special character');