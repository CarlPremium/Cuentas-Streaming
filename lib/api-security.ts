/**
 * API Security Utilities
 * Centralized security functions for API routes
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/supabase/server'
import { ZodSchema, ZodError } from 'zod'

/**
 * Validate request body against a Zod schema
 */
export async function validateRequest<T>(
  request: NextRequest,
  schema: ZodSchema<T>
): Promise<{ success: true; data: T } | { success: false; error: NextResponse }> {
  try {
    const body = await request.json()
    const validatedData = schema.parse(body)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }))
      
      return {
        success: false,
        error: NextResponse.json(
          {
            error: 'Validation failed',
            details: errors,
          },
          { status: 400 }
        ),
      }
    }
    
    return {
      success: false,
      error: NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      ),
    }
  }
}

/**
 * Validate Content-Type header
 */
export function validateContentType(request: NextRequest): NextResponse | null {
  const contentType = request.headers.get('content-type')
  
  if (!contentType?.includes('application/json')) {
    return NextResponse.json(
      { error: 'Content-Type must be application/json' },
      { status: 415 }
    )
  }
  
  return null
}

/**
 * Check request size
 */
export function validateRequestSize(
  request: NextRequest,
  maxSize: number = 1048576 // 1MB default
): NextResponse | null {
  const contentLength = request.headers.get('content-length')
  
  if (contentLength && parseInt(contentLength) > maxSize) {
    return NextResponse.json(
      { error: 'Request payload too large' },
      { status: 413 }
    )
  }
  
  return null
}

/**
 * Verify user role from database (not from client)
 */
export async function verifyUserRole(
  userId: string,
  allowedRoles: string[]
): Promise<{ authorized: boolean; role?: string }> {
  try {
    const supabase = await createClient()
    
    const { data: userData, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single()

    if (error || !userData) {
      return { authorized: false }
    }

    const authorized = allowedRoles.includes((userData as any).role)

    return { authorized, role: (userData as any).role }
  } catch (error) {
    console.error('Error verifying user role:', error)
    return { authorized: false }
  }
}

/**
 * Sanitize error message for client
 * Logs detailed error server-side, returns generic message to client
 */
export function sanitizeError(
  error: unknown,
  context: string,
  publicMessage: string = 'An error occurred'
): { message: string; logged: boolean } {
  // Log detailed error server-side
  console.error(`[${context}]`, {
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    timestamp: new Date().toISOString(),
  })
  
  // Return generic message to client
  return {
    message: publicMessage,
    logged: true,
  }
}

/**
 * Generate request ID for tracing
 */
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
}

/**
 * Add security headers to response
 */
export function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  return response
}

/**
 * Validate numeric ID parameter
 */
export function validateNumericId(id: string): { valid: true; value: number } | { valid: false; error: NextResponse } {
  const numericId = parseInt(id)
  
  if (isNaN(numericId) || numericId <= 0) {
    return {
      valid: false,
      error: NextResponse.json(
        { error: 'Invalid ID parameter' },
        { status: 400 }
      ),
    }
  }
  
  return { valid: true, value: numericId }
}

/**
 * Check if user owns resource or is admin
 */
export async function verifyResourceOwnership(
  userId: string,
  resourceUserId: string
): Promise<{ authorized: boolean; reason?: string }> {
  // Check if user owns the resource
  if (userId === resourceUserId) {
    return { authorized: true }
  }
  
  // Check if user is admin
  const roleCheck = await verifyUserRole(userId, ['admin', 'superadmin'])
  
  if (roleCheck.authorized) {
    return { authorized: true }
  }
  
  return {
    authorized: false,
    reason: 'You do not have permission to access this resource',
  }
}

/**
 * Standardized error response
 */
export function errorResponse(
  message: string,
  status: number = 400,
  details?: any
): NextResponse {
  const response = NextResponse.json(
    {
      error: message,
      ...(details && { details }),
    },
    { status }
  )
  
  return addSecurityHeaders(response)
}

/**
 * Standardized success response
 */
export function successResponse(
  data: any,
  status: number = 200
): NextResponse {
  const response = NextResponse.json(data, { status })
  return addSecurityHeaders(response)
}

