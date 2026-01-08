import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/supabase/server'
import { getUserAPI } from '@/queries/server/users'
import { checkRateLimit, getClientIdentifier } from '@/lib/ddos-protection'
import { verifyTurnstileToken, getTurnstileErrorMessage, isTurnstileEnabled } from '@/lib/turnstile'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const giveawayId = parseInt(id)

    if (isNaN(giveawayId)) {
      return NextResponse.json(
        { error: 'Invalid giveaway ID' },
        { status: 400 }
      )
    }

    // Get request body
    const body = await request.json()
    const { 
      guest_name, 
      telegram_handle,
      fingerprint,
      turnstile_token 
    } = body

    // Validate required fields
    if (!guest_name || !telegram_handle) {
      return NextResponse.json(
        { error: 'Name and Telegram handle are required' },
        { status: 400 }
      )
    }

    if (!fingerprint) {
      return NextResponse.json(
        { error: 'Device verification failed. Please refresh and try again.' },
        { status: 400 }
      )
    }

    // Get client info
    const ip = await getClientIdentifier()
    const userAgent = request.headers.get('user-agent') || 'Unknown'
    const { user } = await getUserAPI()

    // Rate limiting by IP
    const ipRateLimit = await checkRateLimit(`${ip}:join_giveaway`, {
      maxRequests: 10,
      windowMs: 60000, // 1 minute
      blockDurationMs: 300000, // 5 minutes
    })

    if (!ipRateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many attempts. Please wait before trying again.' },
        { status: 429 }
      )
    }

    // Rate limiting by fingerprint
    const fingerprintRateLimit = await checkRateLimit(`${fingerprint}:join_giveaway`, {
      maxRequests: 5,
      windowMs: 60000, // 1 minute
      blockDurationMs: 600000, // 10 minutes
    })

    if (!fingerprintRateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many attempts from this device. Please wait.' },
        { status: 429 }
      )
    }

    // Verify Turnstile token if enabled
    if (isTurnstileEnabled()) {
      if (!turnstile_token) {
        return NextResponse.json(
          { error: 'Please complete the verification challenge' },
          { status: 400 }
        )
      }

      const verification = await verifyTurnstileToken(turnstile_token, ip)
      
      if (!verification.success) {
        const errorMessage = getTurnstileErrorMessage(verification['error-codes'])
        return NextResponse.json(
          { error: errorMessage },
          { status: 400 }
        )
      }
    }

    // Create Supabase client
    const supabase = await createClient()

    // Get giveaway details to check if it's still active
    const { data: giveaway, error: giveawayError } = await supabase
      .from('giveaways')
      .select('end_date, status, max_participants, giveaway_participants(count)')
      .eq('id', giveawayId)
      .is('deleted_at', null)
      .single()

    if (giveawayError || !giveaway) {
      return NextResponse.json(
        { error: 'Giveaway not found' },
        { status: 404 }
      )
    }

    // Check if giveaway has ended
    const endDate = new Date(giveaway.end_date)
    if (endDate < new Date()) {
      return NextResponse.json(
        { error: 'This giveaway has already ended' },
        { status: 400 }
      )
    }

    // Check if giveaway is at max capacity
    const participantCount = giveaway.giveaway_participants?.[0]?.count || 0
    if (giveaway.max_participants && participantCount >= giveaway.max_participants) {
      return NextResponse.json(
        { error: 'This giveaway has reached maximum capacity' },
        { status: 400 }
      )
    }

    // Check if already participated (pre-check for better UX)
    const { data: checkData } = await supabase.rpc('check_participation', {
      p_giveaway_id: giveawayId,
      p_telegram_handle: telegram_handle,
      p_fingerprint: fingerprint,
      p_ip_address: ip,
    } as any)

    if (checkData && (checkData as any).participated) {
      return NextResponse.json(
        {
          error: (checkData as any).message || 'You have already participated in this giveaway',
          already_participated: true,
          method: (checkData as any).method
        },
        { status: 400 }
      )
    }

    // Join giveaway using secure function
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
      console.error('Error joining giveaway:', error)
      return NextResponse.json(
        { error: 'Failed to join giveaway. Please try again.' },
        { status: 500 }
      )
    }

    if (!(data as any)?.success) {
      return NextResponse.json(
        { error: (data as any).error || 'Failed to join giveaway' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: (data as any).message || 'Successfully joined the giveaway!',
      participant_id: data.participant_id,
    })

  } catch (error) {
    console.error('Error in join giveaway route:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

