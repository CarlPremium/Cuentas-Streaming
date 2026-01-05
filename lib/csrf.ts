/**
 * CSRF Protection
 * Addresses CRITICAL vulnerability #3 from security audit
 * 
 * For Next.js App Router, we use the double-submit cookie pattern
 * with SameSite cookies for CSRF protection.
 */

import { NextRequest } from 'next/server'
import { createHash, randomBytes } from 'crypto'

const CSRF_TOKEN_LENGTH = 32
const CSRF_COOKIE_NAME = 'csrf_token'
const CSRF_HEADER_NAME = 'x-csrf-token'

/**
 * Generate a CSRF token
 */
export function generateCsrfToken(): string {
  return randomBytes(CSRF_TOKEN_LENGTH).toString('hex')
}

/**
 * Hash a CSRF token for comparison
 */
function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

/**
 * Verify CSRF token from request
 */
export function verifyCsrfToken(request: NextRequest): boolean {
  // Get token from header
  const headerToken = request.headers.get(CSRF_HEADER_NAME)

  // Get token from cookie
  const cookieToken = request.cookies.get(CSRF_COOKIE_NAME)?.value

  if (!headerToken || !cookieToken) {
    return false
  }

  // Compare hashed tokens to prevent timing attacks
  const headerHash = hashToken(headerToken)
  const cookieHash = hashToken(cookieToken)

  return headerHash === cookieHash
}

/**
 * CSRF middleware for API routes
 * Use this in routes that modify state (POST, PUT, DELETE, PATCH)
 */
export function withCsrfProtection<T extends unknown[]>(
  handler: (...args: T) => Promise<Response>
) {
  return async (...args: T): Promise<Response> => {
    const request = args[0] as NextRequest

    // Skip CSRF check for GET and HEAD requests
    if (request.method === 'GET' || request.method === 'HEAD') {
      return handler(...args)
    }

    // Verify CSRF token
    if (!verifyCsrfToken(request)) {
      return new Response(
        JSON.stringify({
          error: {
            code: 'CSRF_TOKEN_INVALID',
            message: 'CSRF token validation failed',
            userMessage: 'Security validation failed. Please refresh the page and try again',
          },
        }),
        {
          status: 403,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }

    return handler(...args)
  }
}

/**
 * Alternative: Use Next.js built-in CSRF protection
 * 
 * Next.js 13+ has built-in CSRF protection for Server Actions.
 * For API routes, you can rely on:
 * 1. SameSite cookies (already set by Supabase)
 * 2. Origin header validation
 * 3. Custom header requirement (X-Requested-With)
 */

/**
 * Validate request origin
 */
export function validateOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin')
  const host = request.headers.get('host')

  if (!origin) {
    // No origin header - might be same-origin request
    // Check for custom header to ensure it's from our app
    return !!request.headers.get('x-requested-with')
  }

  // Validate origin matches host
  try {
    const originUrl = new URL(origin)
    return originUrl.host === host
  } catch {
    return false
  }
}

/**
 * Lightweight CSRF protection using origin validation
 * Suitable for APIs that use SameSite cookies
 */
export function withOriginValidation<T extends unknown[]>(
  handler: (...args: T) => Promise<Response>
) {
  return async (...args: T): Promise<Response> => {
    const request = args[0] as NextRequest

    // Skip for GET and HEAD requests
    if (request.method === 'GET' || request.method === 'HEAD') {
      return handler(...args)
    }

    // Validate origin
    if (!validateOrigin(request)) {
      return new Response(
        JSON.stringify({
          error: {
            code: 'INVALID_ORIGIN',
            message: 'Invalid request origin',
            userMessage: 'Security validation failed. Please refresh the page and try again',
          },
        }),
        {
          status: 403,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }

    return handler(...args)
  }
}

/**
 * Export the recommended approach
 * 
 * For most Next.js apps with Supabase:
 * - Use origin validation (simpler, works with SameSite cookies)
 * - Supabase already sets SameSite=Lax on auth cookies
 * - This provides good CSRF protection without token management
 */
export const csrf = {
  verify: verifyCsrfToken,
  generate: generateCsrfToken,
  validateOrigin,
  withProtection: withOriginValidation, // Recommended
  withTokenProtection: withCsrfProtection, // If you need explicit tokens
}
