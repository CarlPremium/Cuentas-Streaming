/**
 * Giveaway API Validation Schemas
 * Using Zod for type-safe validation
 */

import { z } from 'zod'

/**
 * Schema for creating a new giveaway
 */
export const createGiveawaySchema = z.object({
  title: z.string()
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title must not exceed 200 characters')
    .trim(),
  
  description: z.string()
    .max(2000, 'Description must not exceed 2000 characters')
    .trim()
    .optional(),
  
  thumbnail_url: z.string()
    .url('Invalid thumbnail URL')
    .max(500, 'URL too long')
    .optional()
    .or(z.literal('')),
  
  start_date: z.string()
    .datetime('Invalid start date format')
    .optional(),
  
  end_date: z.string()
    .datetime('Invalid end date format')
    .refine((date) => new Date(date) > new Date(), {
      message: 'End date must be in the future'
    }),
  
  max_participants: z.number()
    .int('Must be a whole number')
    .positive('Must be greater than 0')
    .max(1000000, 'Maximum participants limit exceeded')
    .optional()
    .nullable(),
  
  is_featured: z.boolean()
    .optional()
    .default(false),
  
  allow_guests: z.boolean()
    .optional()
    .default(true),
  
  require_email: z.boolean()
    .optional()
    .default(false),
})

/**
 * Schema for joining a giveaway
 */
export const joinGiveawaySchema = z.object({
  guest_name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .trim()
    .regex(/^[a-zA-Z0-9\s\u00C0-\u017F]+$/, 'Name contains invalid characters'),
  
  telegram_handle: z.string()
    .min(5, 'Telegram handle must be at least 5 characters')
    .max(33, 'Telegram handle must not exceed 32 characters')
    .trim()
    .regex(/^@?[a-zA-Z0-9_]{5,32}$/, 'Invalid Telegram handle format. Use @username (5-32 characters, letters, numbers, and underscores only)')
    .transform((val) => val.startsWith('@') ? val : `@${val}`)
    .transform((val) => val.toLowerCase()),
  
  fingerprint: z.string()
    .min(32, 'Invalid device fingerprint')
    .max(256, 'Invalid device fingerprint'),
  
  turnstile_token: z.string()
    .optional()
    .nullable(),
})

/**
 * Schema for checking participation
 */
export const checkParticipationSchema = z.object({
  telegram_handle: z.string()
    .trim()
    .optional(),
  
  fingerprint: z.string()
    .optional(),
})

/**
 * Schema for giveaway query parameters
 */
export const giveawayQuerySchema = z.object({
  status: z.enum(['active', 'running', 'ended', 'cancelled'])
    .optional()
    .default('active'),
  
  featured: z.enum(['true', 'false'])
    .optional(),
  
  page: z.string()
    .regex(/^\d+$/, 'Page must be a number')
    .transform(Number)
    .refine((n) => n > 0, 'Page must be greater than 0')
    .optional()
    .default('1'),
  
  per_page: z.string()
    .regex(/^\d+$/, 'Per page must be a number')
    .transform(Number)
    .refine((n) => n > 0 && n <= 100, 'Per page must be between 1 and 100')
    .optional()
    .default('20'),
})

/**
 * Type exports for TypeScript
 */
export type CreateGiveawayInput = z.infer<typeof createGiveawaySchema>
export type JoinGiveawayInput = z.infer<typeof joinGiveawaySchema>
export type CheckParticipationInput = z.infer<typeof checkParticipationSchema>
export type GiveawayQueryInput = z.infer<typeof giveawayQuerySchema>

/**
 * Helper to format Zod validation errors for user display
 */
export function formatZodError(error: z.ZodError): string {
  const firstError = error.errors[0]
  return firstError?.message || 'Invalid input'
}

/**
 * Helper to get all validation errors
 */
export function getAllZodErrors(error: z.ZodError): Record<string, string> {
  return error.errors.reduce((acc, err) => {
    const path = err.path.join('.')
    acc[path] = err.message
    return acc
  }, {} as Record<string, string>)
}

