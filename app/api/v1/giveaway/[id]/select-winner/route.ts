import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/supabase/server'
import { getUserAPI } from '@/queries/server/users'

/**
 * Select winner for giveaway
 * SECURITY FIX #2: Database-verified role check
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const giveawayId = parseInt(id)
    const { user } = await getUserAPI()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()

    // SECURITY FIX #2: Verify role from database, not client
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userError || !userData) {
      console.error('Error fetching user role:', userError)
      return NextResponse.json(
        { error: 'Failed to verify permissions' },
        { status: 500 }
      )
    }

    // Check if user owns the giveaway or is admin
    const { data: giveaway } = await supabase
      .from('giveaways')
      .select('user_id')
      .eq('id', giveawayId)
      .single()

    if (!giveaway) {
      return NextResponse.json({ error: 'Giveaway not found' }, { status: 404 })
    }

    const isOwner = giveaway.user_id === user.id
    const isAdmin = ['admin', 'superadmin'].includes(userData.role)

    if (!isOwner && !isAdmin) {
      console.warn(`Unauthorized winner selection attempt by user ${user.id}`)
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Select winner
    const { data, error } = await supabase.rpc('select_giveaway_winner', {
      p_giveaway_id: giveawayId,
    })

    if (error) {
      console.error('Error selecting winner:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    const result = data as {
      success: boolean
      error?: string
      winner_id?: string
      winner_guest_id?: string
      winner_name?: string
      telegram_handle?: string
    }

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      winner_id: result.winner_id,
      winner_guest_id: result.winner_guest_id,
      winner_name: result.winner_name,
      telegram_handle: result.telegram_handle,
    })
  } catch (error) {
    console.error('Unexpected error in select winner:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
