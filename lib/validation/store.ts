/**
 * Store API Validation Schemas
 * Using Zod for type-safe validation
 */

import { z } from 'zod'

/**
 * Schema for creating a new product
 */
export const createProductSchema = z.object({
  name: z.string()
    .min(3, 'Product name must be at least 3 characters')
    .max(200, 'Product name must not exceed 200 characters')
    .trim(),

  slug: z.string()
    .min(3, 'Slug must be at least 3 characters')
    .max(200, 'Slug must not exceed 200 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens')
    .trim(),

  description: z.string()
    .max(2000, 'Description must not exceed 2000 characters')
    .trim()
    .optional(),

  price: z.number()
    .positive('Price must be greater than 0')
    .max(999999.99, 'Price exceeds maximum allowed value')
    .multipleOf(0.01, 'Price must have at most 2 decimal places'),

  original_price: z.number()
    .positive('Original price must be greater than 0')
    .max(999999.99, 'Original price exceeds maximum allowed value')
    .multipleOf(0.01, 'Original price must have at most 2 decimal places')
    .optional()
    .nullable(),

  currency: z.string()
    .length(3, 'Currency must be a 3-letter code')
    .regex(/^[A-Z]{3}$/, 'Currency must be uppercase letters (e.g., USD, EUR)')
    .default('USD')
    .optional(),

  image_url: z.string()
    .url('Invalid image URL')
    .max(500, 'Image URL too long')
    .optional()
    .or(z.literal('')),

  thumbnail_url: z.string()
    .url('Invalid thumbnail URL')
    .max(500, 'Thumbnail URL too long')
    .optional()
    .or(z.literal('')),

  category: z.string()
    .min(1, 'Category is required')
    .max(100, 'Category name too long')
    .trim(),

  duration: z.string()
    .max(50, 'Duration text too long')
    .trim()
    .optional()
    .nullable(),

  features: z.array(
    z.string()
      .min(1, 'Feature cannot be empty')
      .max(200, 'Feature text too long')
  )
    .max(20, 'Maximum 20 features allowed')
    .default([])
    .optional(),

  is_active: z.boolean()
    .default(true)
    .optional(),

  is_featured: z.boolean()
    .default(false)
    .optional(),

  is_popular: z.boolean()
    .default(false)
    .optional(),

  stock_quantity: z.number()
    .int('Stock quantity must be a whole number')
    .min(0, 'Stock quantity cannot be negative')
    .max(999999, 'Stock quantity exceeds maximum')
    .optional()
    .nullable(),

  unlimited_stock: z.boolean()
    .default(true)
    .optional(),

  meta_title: z.string()
    .max(200, 'Meta title too long')
    .trim()
    .optional()
    .nullable(),

  meta_description: z.string()
    .max(500, 'Meta description too long')
    .trim()
    .optional()
    .nullable(),

  keywords: z.array(z.string().max(50))
    .max(20, 'Maximum 20 keywords allowed')
    .optional()
    .nullable(),

  sort_order: z.number()
    .int('Sort order must be a whole number')
    .min(0, 'Sort order cannot be negative')
    .default(0)
    .optional(),
})
  .refine(
    (data) => {
      if (data.original_price && data.price) {
        return data.original_price >= data.price
      }
      return true
    },
    {
      message: 'Original price must be greater than or equal to sale price',
      path: ['original_price'],
    }
  )
  .refine(
    (data) => {
      if (!data.unlimited_stock && !data.stock_quantity) {
        return false
      }
      return true
    },
    {
      message: 'Stock quantity is required when unlimited_stock is false',
      path: ['stock_quantity'],
    }
  )

/**
 * Schema for updating a product (all fields optional)
 */
export const updateProductSchema = z.object({
  name: z.string()
    .min(3, 'Product name must be at least 3 characters')
    .max(200, 'Product name must not exceed 200 characters')
    .trim()
    .optional(),

  slug: z.string()
    .min(3, 'Slug must be at least 3 characters')
    .max(200, 'Slug must not exceed 200 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens')
    .trim()
    .optional(),

  description: z.string()
    .max(2000, 'Description must not exceed 2000 characters')
    .trim()
    .optional()
    .nullable(),

  price: z.number()
    .positive('Price must be greater than 0')
    .max(999999.99, 'Price exceeds maximum allowed value')
    .multipleOf(0.01, 'Price must have at most 2 decimal places')
    .optional(),

  original_price: z.number()
    .positive('Original price must be greater than 0')
    .max(999999.99, 'Original price exceeds maximum allowed value')
    .multipleOf(0.01, 'Original price must have at most 2 decimal places')
    .optional()
    .nullable(),

  currency: z.string()
    .length(3, 'Currency must be a 3-letter code')
    .regex(/^[A-Z]{3}$/, 'Currency must be uppercase letters (e.g., USD, EUR)')
    .optional(),

  image_url: z.string()
    .url('Invalid image URL')
    .max(500, 'Image URL too long')
    .optional()
    .or(z.literal('')),

  thumbnail_url: z.string()
    .url('Invalid thumbnail URL')
    .max(500, 'Thumbnail URL too long')
    .optional()
    .or(z.literal('')),

  category: z.string()
    .min(1, 'Category is required')
    .max(100, 'Category name too long')
    .trim()
    .optional(),

  duration: z.string()
    .max(50, 'Duration text too long')
    .trim()
    .optional()
    .nullable(),

  features: z.array(
    z.string()
      .min(1, 'Feature cannot be empty')
      .max(200, 'Feature text too long')
  )
    .max(20, 'Maximum 20 features allowed')
    .optional(),

  is_active: z.boolean()
    .optional(),

  is_featured: z.boolean()
    .optional(),

  is_popular: z.boolean()
    .optional(),

  stock_quantity: z.number()
    .int('Stock quantity must be a whole number')
    .min(0, 'Stock quantity cannot be negative')
    .max(999999, 'Stock quantity exceeds maximum')
    .optional()
    .nullable(),

  unlimited_stock: z.boolean()
    .optional(),

  meta_title: z.string()
    .max(200, 'Meta title too long')
    .trim()
    .optional()
    .nullable(),

  meta_description: z.string()
    .max(500, 'Meta description too long')
    .trim()
    .optional()
    .nullable(),

  keywords: z.array(z.string().max(50))
    .max(20, 'Maximum 20 keywords allowed')
    .optional()
    .nullable(),

  sort_order: z.number()
    .int('Sort order must be a whole number')
    .min(0, 'Sort order cannot be negative')
    .optional(),
})

/**
 * Schema for updating order status
 */
export const updateOrderSchema = z.object({
  status: z.enum(['pending', 'processing', 'completed', 'cancelled'], {
    errorMap: () => ({ message: 'Invalid order status' }),
  })
    .optional(),

  payment_status: z.enum(['pending', 'completed', 'failed', 'refunded'], {
    errorMap: () => ({ message: 'Invalid payment status' }),
  })
    .optional(),

  delivery_status: z.enum(['pending', 'delivered', 'failed'], {
    errorMap: () => ({ message: 'Invalid delivery status' }),
  })
    .optional(),

  delivery_notes: z.string()
    .max(1000, 'Delivery notes too long')
    .trim()
    .optional()
    .nullable(),

  notes: z.string()
    .max(2000, 'Notes too long')
    .trim()
    .optional()
    .nullable(),

  payment_id: z.string()
    .max(200, 'Payment ID too long')
    .trim()
    .optional()
    .nullable(),
})
  .refine(
    (data) => {
      // At least one field must be provided
      return Object.keys(data).length > 0
    },
    {
      message: 'At least one field must be updated',
    }
  )

/**
 * Schema for creating an order
 */
export const createOrderSchema = z.object({
  product_id: z.number()
    .int('Product ID must be a whole number')
    .positive('Invalid product ID'),

  customer_email: z.string()
    .email('Invalid email address')
    .max(255, 'Email too long')
    .trim(),

  customer_name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(200, 'Name too long')
    .trim()
    .optional()
    .nullable(),

  customer_telegram: z.string()
    .min(5, 'Telegram handle must be at least 5 characters')
    .max(33, 'Telegram handle too long')
    .regex(/^@?[a-zA-Z0-9_]{5,32}$/, 'Invalid Telegram handle format')
    .transform((val) => val.startsWith('@') ? val : `@${val}`)
    .optional()
    .nullable(),

  payment_method: z.enum(['binance', 'paypal', 'other'], {
    errorMap: () => ({ message: 'Invalid payment method' }),
  }),

  turnstile_token: z.string()
    .optional()
    .nullable(),
})

/**
 * Schema for store settings update
 */
export const updateStoreSettingsSchema = z.object({
  telegram_handle: z.string()
    .min(5, 'Telegram handle must be at least 5 characters')
    .max(33, 'Telegram handle too long')
    .regex(/^@?[a-zA-Z0-9_]{5,32}$/, 'Invalid Telegram handle format')
    .transform((val) => val.startsWith('@') ? val : `@${val}`)
    .optional(),

  telegram_chat_id: z.string()
    .max(100, 'Chat ID too long')
    .optional()
    .nullable(),

  binance_enabled: z.boolean()
    .optional(),

  binance_pay_id: z.string()
    .max(200, 'Binance Pay ID too long')
    .optional()
    .nullable(),

  paypal_enabled: z.boolean()
    .optional(),

  paypal_email: z.string()
    .email('Invalid PayPal email')
    .max(255, 'Email too long')
    .optional()
    .nullable(),

  store_name: z.string()
    .min(1, 'Store name is required')
    .max(200, 'Store name too long')
    .optional(),

  store_description: z.string()
    .max(1000, 'Description too long')
    .optional()
    .nullable(),

  support_email: z.string()
    .email('Invalid support email')
    .max(255, 'Email too long')
    .optional()
    .nullable(),

  notify_new_orders: z.boolean()
    .optional(),

  notify_email: z.string()
    .email('Invalid notification email')
    .max(255, 'Email too long')
    .optional()
    .nullable(),

  maintenance_mode: z.boolean()
    .optional(),

  maintenance_message: z.string()
    .max(500, 'Maintenance message too long')
    .optional()
    .nullable(),
})

/**
 * Schema for product query parameters
 */
export const productQuerySchema = z.object({
  category: z.string()
    .max(100)
    .optional(),

  is_featured: z.enum(['true', 'false'])
    .transform(val => val === 'true')
    .optional(),

  is_active: z.enum(['true', 'false'])
    .transform(val => val === 'true')
    .optional()
    .default('true'),

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

  sort: z.enum(['created_at', 'price', 'name', 'sort_order'])
    .optional()
    .default('sort_order'),

  order: z.enum(['asc', 'desc'])
    .optional()
    .default('asc'),
})

/**
 * Schema for order query parameters
 */
export const orderQuerySchema = z.object({
  status: z.enum(['pending', 'processing', 'completed', 'cancelled'])
    .optional(),

  payment_status: z.enum(['pending', 'completed', 'failed', 'refunded'])
    .optional(),

  page: z.string()
    .regex(/^\d+$/)
    .transform(Number)
    .refine((n) => n > 0)
    .optional()
    .default('1'),

  per_page: z.string()
    .regex(/^\d+$/)
    .transform(Number)
    .refine((n) => n > 0 && n <= 100)
    .optional()
    .default('20'),
})

/**
 * Type exports for TypeScript
 */
export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>
export type CreateOrderInput = z.infer<typeof createOrderSchema>
export type UpdateStoreSettingsInput = z.infer<typeof updateStoreSettingsSchema>
export type ProductQueryInput = z.infer<typeof productQuerySchema>
export type OrderQueryInput = z.infer<typeof orderQuerySchema>

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
