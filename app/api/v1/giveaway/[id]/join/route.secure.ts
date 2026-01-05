/**
 * SECURE VERSION - Join Giveaway API Route
 * 
 * This is the improved version with all security enhancements.
 * To activate: rename this file to route.ts (backup the old one first)
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/supabase/server'
import { getUserAPI } from '@/queries/server/users'
import { checkRateLimit, getClientIdentifier } from '@/lib/ddos-protection'
import { verifyTurnstileToken, getTurnstileErrorMessage, isTurnstileEnabled } from '@/lib/turnstile'
import {
  validateRequest,
  validateContentType,
  validateRequestSize,
  validateNumericId,
  sanitizeError,
  generateRequestId,
  errorResponse,
  successResponse,
} from '@/lib/api-security'
import { joinGiveawaySchema } from '@/lib/validation/giveaway'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const requestId = generateRequestId()
  
  try {
    // 1. Validate ID parameter
    const { id } = await params
    const idValidation = validateNumericId(id)
    if (!idValidation.valid) {
      return (idValidation as any).error
    }
    const giveawayId = idValidation.value

    // 2. Validate Content-Type
    const contentTypeError = validateContentType(request)
    if (contentTypeError) {
      return contentTypeError
    }

    // 3. Validate request size
    const sizeError = validateRequestSize(request, 10240) // 10KB max
    if (sizeError) {
      return sizeError
    }

    // 4. Validate and parse request body
    const validation = await validateRequest(request, joinGiveawaySchema)
    if (!validation.success) {
      return (validation as any).error
    }

    const { guest_name, telegram_handle, fingerprint, turnstile_token } = validation.data

    // 5. Get client info
    const ip = await getClientIdentifier()
    const userAgent = request.headers.get('user-agent') || 'Unknown'
    const { user } = await getUserAPI()

    // 6. Rate limiting by IP (strict)
    const ipRateLimit = await checkRateLimit(`${ip}:join_giveaway`, {
      maxRequests: 10,
      windowMs: 60000, // 1 minute
      blockDurationMs: 300000, // 5 minutes
    })

    if (!ipRateLimit.allowed) {
      console.warn(`[${requestId}] Rate limit exceeded for IP: ${ip}`)
      return errorResponse(
        'Too many attempts. Please wait before trying again.',
        429
      )
    }

    // 7. Rate limiting by fingerprint (very strict)
    const fingerprintRateLimit = await checkRateLimit(`${fingerprint}:join_giveaway`, {
      maxRequests: 5,
      windowMs: 60000, // 1 minute
      blockDurationMs: 600000, // 10 minutes
    })

    if (!fingerprintRateLimit.allowed) {
      console.warn(`[${requestId}] Rate limit exceeded for fingerprint: ${fingerprint.substring(0, 10)}...`)
      return errorResponse(
        'Too many attempts from this device. Please wait.',
        429
      )
    }

    // 8. Verify Turnstile token if enabled
    if (isTurnstileEnabled()) {
      if (!turnstile_token) {
        return errorResponse(
          'Please complete the verification challenge',
          400
        )
      }

      const verification = await verifyTurnstileToken(turnstile_token, ip)
      
      if (!verification.success) {
        const errorMessage = getTurnstileErrorMessage(verification['error-codes'])
        console.warn(`[${requestId}] Turnstile verification failed:`, verification['error-codes'])
        return errorResponse(errorMessage, 400)
      }

      console.info(`[${requestId}] Turnstile verification successful`)
    }

    // 9. Create Supabase client
    const supabase = await createClient()

    // 10. Pre-check if already participated (better UX)
    const { data: checkData, error: checkError } = await supabase.rpc('check_participation', {
      p_giveaway_id: giveawayId,
      p_telegram_handle: telegram_handle,
      p_fingerprint: fingerprint,
      p_ip_address: ip,
    } as any)

    if (checkError) {
      const sanitized = sanitizeError(
        checkError,
        `${requestId}:CHECK_PARTICIPATION`,
        'Failed to verify participation status'
      )
      return errorResponse(sanitized.message, 500)
    }

    if (checkData && (checkData as any).participated) {
      console.info(`[${requestId}] User already participated via ${(checkData as any).method}`)
      return errorResponse(
        (checkData as any).message || 'You have already participated in this giveaway',
        400,
        {
          already_participated: true,
          method: (checkData as any).method,
        }
      )
    }

    // 11. Join giveaway using secure database function
    const { data, error } = await supabase.rpc('join_giveaway_secure', {
      p_giveaway_id: giveawayId,
      p_telegram_handle: telegram_handle,
      p_guest_name: guest_name,
      p_ip_address: ip,
      p_fingerprint: fingerprint,
      p_turnstile_token: turnstile_token || null,
      p_user_agent: userAgent,
    } as any)

    if (error) {
      const sanitized = sanitizeError(
        error,
        `${requestId}:JOIN_GIVEAWAY`,
        'Failed to join giveaway. Please try again.'
      )
      return errorResponse(sanitized.message, 500)
    }

    if (!(data as any)?.success) {
      console.warn(`[${requestId}] Join failed:`, (data as any).error)
      return errorResponse((data as any).error || 'Failed to join giveaway', 400)
    }

    // 12. Success response
    console.info(`[${requestId}] Successfully joined giveaway ${giveawayId}`)

    return successResponse({
      success: true,
      message: (data as any).message || 'Successfully joined the giveaway!',
      participant_id: (data as any).participant_id,
      request_id: requestId,
    })

  } catch (error) {
    const sanitized = sanitizeError(
      error,
      `${requestId}:UNEXPECTED_ERROR`,
      'An unexpected error occurred'
    )
    return errorResponse(sanitized.message, 500)
  }
}

