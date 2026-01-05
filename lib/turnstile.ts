/**
 * Cloudflare Turnstile Verification
 * 
 * Provides server-side verification for Cloudflare Turnstile tokens
 * to prevent bot abuse and automated submissions.
 */

const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY
const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

export interface TurnstileVerificationResult {
  success: boolean
  'error-codes'?: string[]
  challenge_ts?: string
  hostname?: string
  action?: string
  cdata?: string
}

/**
 * Verify a Turnstile token
 * @param token - The Turnstile token from the client
 * @param ip - Optional IP address of the client
 * @returns Verification result
 */
export async function verifyTurnstileToken(
  token: string,
  ip?: string
): Promise<TurnstileVerificationResult> {
  if (!TURNSTILE_SECRET_KEY) {
    console.error('TURNSTILE_SECRET_KEY is not configured')
    return {
      success: false,
      'error-codes': ['missing-secret-key'],
    }
  }

  if (!token) {
    return {
      success: false,
      'error-codes': ['missing-input-response'],
    }
  }

  try {
    const formData = new FormData()
    formData.append('secret', TURNSTILE_SECRET_KEY)
    formData.append('response', token)
    
    if (ip) {
      formData.append('remoteip', ip)
    }

    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      console.error('Turnstile verification failed:', response.statusText)
      return {
        success: false,
        'error-codes': ['verification-failed'],
      }
    }

    const result: TurnstileVerificationResult = await response.json()
    
    if (!result.success) {
      console.warn('Turnstile verification unsuccessful:', result['error-codes'])
    }

    return result
  } catch (error) {
    console.error('Error verifying Turnstile token:', error)
    return {
      success: false,
      'error-codes': ['internal-error'],
    }
  }
}

/**
 * Get human-readable error message from Turnstile error codes
 */
export function getTurnstileErrorMessage(errorCodes?: string[]): string {
  if (!errorCodes || errorCodes.length === 0) {
    return 'Verification failed. Please try again.'
  }

  const errorMessages: Record<string, string> = {
    'missing-input-secret': 'Server configuration error',
    'invalid-input-secret': 'Server configuration error',
    'missing-input-response': 'Please complete the verification',
    'invalid-input-response': 'Verification expired. Please try again.',
    'bad-request': 'Invalid request. Please refresh and try again.',
    'timeout-or-duplicate': 'Verification expired. Please try again.',
    'internal-error': 'Verification service error. Please try again later.',
  }

  const firstError = errorCodes[0]
  return errorMessages[firstError] || 'Verification failed. Please try again.'
}

/**
 * Middleware to check if Turnstile is enabled
 */
export function isTurnstileEnabled(): boolean {
  return !!TURNSTILE_SECRET_KEY && !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
}

