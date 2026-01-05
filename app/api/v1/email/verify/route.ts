import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/supabase/server'
import { ApiError, getBaseUrl } from '@/lib/utils'
import { revalidates } from '@/lib/utils/cache'
import { authorize } from '@/queries/server/auth'
import { checkRateLimit, getClientIdentifier } from '@/lib/ddos-protection'

import { transporter, sender } from '@/lib/nodemailer'
import { jwtSign } from '@/lib/jsonwebtoken'
import { type VerifyTokenPayload } from '@/types/token'

export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId') as string

    const { data, options } = await request.json()
    const { authorized } = await authorize(userId)

    if (!authorized) {
      return NextResponse.json(
        { data: null, error: new ApiError(401) },
        { status: 401 }
      )
    }

    // SECURITY FIX #6: Rate limiting for email verification
    const identifier = await getClientIdentifier()
    const rateLimit = await checkRateLimit(`${identifier}:email_verify:${userId}`, {
      maxRequests: 3,
      windowMs: 3600000, // 1 hour
      blockDurationMs: 86400000, // 24 hours
    })

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          data: null, 
          error: new ApiError(429, 'Too many verification requests. Please try again later.') 
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(rateLimit.resetAt).toISOString(),
          },
        }
      )
    }

    const payload: VerifyTokenPayload = {
      email: data?.email,
      user_id: userId,
    }
    const mailOptions = mailTemplate(payload)

    const info = await transporter.sendMail(mailOptions)

    return NextResponse.json({
      data: info,
      error: null,
      revalidated: revalidates(options),
      now: Date.now(),
    })
  } catch (e: unknown) {
    console.error('Error sending verification email:', e)
    return NextResponse.json(
      { data: null, error: new ApiError(400, (e as Error)?.message) },
      { status: 400 }
    )
  }
}

function mailTemplate(payload: VerifyTokenPayload) {
  const url = generate_url(payload)

  return {
    from: `"${sender?.name}" <${sender?.email}>`,
    to: payload?.email,
    subject: 'Email Verification',
    html: `
      <div>
        <h2>Verify Link</h2>
        <p>Click the link below to verify your email:</p>
        <p><a href="${url}">Verify email address</a></p>
      </div>
    `,
  }
}

function generate_url(payload: string | object | Buffer) {
  const token_hash = jwtSign(payload, { expiresIn: '10m' })
  const url = new URL(getBaseUrl())
  url.pathname = '/api/verify/email'
  url.searchParams.set('token_hash', token_hash)
  url.searchParams.set('next', '/dashboard/settings/emails')

  return url.toString()
}
