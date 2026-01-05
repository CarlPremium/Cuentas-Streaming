import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/supabase/server'
import { getClientIdentifier } from '@/lib/ddos-protection'

/**
 * Check if user has already participated in a giveaway
 * POST /api/v1/giveaway/[id]/check
 */
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

    const body = await request.json()
    const { telegram_handle, fingerprint } = body

    // Get IP address
    const ip = await getClientIdentifier()

    // Create Supabase client
    const supabase = await createClient()

    // Check participation
    const { data, error } = await supabase.rpc('check_participation', {
      p_giveaway_id: giveawayId,
      p_telegram_handle: telegram_handle || null,
      p_fingerprint: fingerprint || null,
      p_ip_address: ip || null,
    } as any)

    if (error) {
      console.error('Error checking participation:', error)
      return NextResponse.json(
        { participated: false },
        { status: 200 }
      )
    }

    return NextResponse.json(data || { participated: false })

  } catch (error) {
    console.error('Error in check participation route:', error)
    return NextResponse.json(
      { participated: false },
      { status: 200 }
    )
  }
}
