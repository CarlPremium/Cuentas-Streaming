/**
 * User API Validation Schemas
 * Addresses CRITICAL vulnerability #1 from security audit
 */

import { z } from 'zod'

// Username validation
export const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(30, 'Username must not exceed 30 characters')
  .regex(
    /^[a-zA-Z0-9_]+$/,
    'Username can only contain letters, numbers, and underscores'
  )
  .transform((val) => val.toLowerCase())

// User update schema
export const userUpdateSchema = z.object({
  username: usernameSchema.optional(),
  full_name: z
    .string()
    .min(1, 'Full name is required')
    .max(100, 'Full name is too long')
    .optional(),
  bio: z
    .string()
    .max(500, 'Bio is too long (max 500 characters)')
    .optional(),
  avatar_url: z
    .string()
    .url('Invalid avatar URL')
    .max(500, 'URL is too long')
    .optional()
    .or(z.literal('')),
  website: z
    .string()
    .url('Invalid website URL')
    .max(200, 'URL is too long')
    .optional()
    .or(z.literal('')),
  location: z
    .string()
    .max(100, 'Location is too long')
    .optional(),
  twitter: z
    .string()
    .max(50, 'Twitter handle is too long')
    .regex(/^@?[a-zA-Z0-9_]+$/, 'Invalid Twitter handle')
    .optional()
    .or(z.literal('')),
  github: z
    .string()
    .max(50, 'GitHub username is too long')
    .regex(/^[a-zA-Z0-9-]+$/, 'Invalid GitHub username')
    .optional()
    .or(z.literal('')),
})

// User meta schema
export const userMetaSchema = z.object({
  id: z.number().optional(),
  user_id: z.string().uuid('Invalid user ID'),
  meta_key: z
    .string()
    .min(1, 'Meta key is required')
    .max(100, 'Meta key is too long')
    .regex(/^[a-z0-9_]+$/, 'Meta key can only contain lowercase letters, numbers, and underscores'),
  meta_value: z.string().max(5000, 'Meta value is too long'),
})

// Complete user update request schema
export const userUpdateRequestSchema = z.object({
  data: z.object({
    meta: z.array(userMetaSchema).optional(),
  }).and(userUpdateSchema),
  options: z.object({
    revalidate: z.boolean().optional(),
    paths: z.array(z.string()).optional(),
  }).optional(),
})

/**
 * Helper to format Zod validation errors
 */
export function formatUserValidationError(error: z.ZodError): string {
  const firstError = error.errors[0]
  return firstError?.message || 'Invalid input'
}

/**
 * Helper to get all validation errors
 */
export function getAllUserValidationErrors(error: z.ZodError): Record<string, string> {
  return error.errors.reduce((acc, err) => {
    const path = err.path.join('.')
    acc[path] = err.message
    return acc
  }, {} as Record<string, string>)
}
