import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/supabase/server'
import { getUserAPI } from '@/queries/server/users'

/**
 * Get giveaway details by ID
 * GET /api/v1/giveaway/[id]
 */
export async function GET(
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

    const supabase = await createClient()

    // Get giveaway with participant count
    const { data: giveaway, error } = await supabase
      .from('giveaways')
      .select(`
        *,
        users!giveaways_user_id_fkey(username, full_name, avatar_url),
        giveaway_participants(count)
      `)
      .eq('id', giveawayId)
      .is('deleted_at', null)
      .single()

    if (error) {
      console.error('Error fetching giveaway:', error)
      return NextResponse.json(
        { error: 'Giveaway not found' },
        { status: 404 }
      )
    }

    if (!giveaway) {
      return NextResponse.json(
        { error: 'Giveaway not found' },
        { status: 404 }
      )
    }

    // Check if giveaway is banned
    if (giveaway.is_banned) {
      return NextResponse.json(
        { error: 'This giveaway has been suspended' },
        { status: 403 }
      )
    }

    // Calculate participant count
    const participantCount = giveaway.giveaway_participants?.[0]?.count || 0

    return NextResponse.json({
      ...giveaway,
      participant_count: participantCount,
    })

  } catch (error) {
    console.error('Error in get giveaway route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Delete giveaway (soft delete)
 * DELETE /api/v1/giveaway/[id]
 * SECURITY: Admin only OR giveaway owner
 */
export async function DELETE(
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

    // Check authentication
    const { user } = await getUserAPI()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()

    // Verify role from database (not client)
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

    // Get giveaway to check ownership
    const { data: giveaway, error: giveawayError } = await supabase
      .from('giveaways')
      .select('user_id, title')
      .eq('id', giveawayId)
      .is('deleted_at', null)
      .single()

    if (giveawayError || !giveaway) {
      return NextResponse.json(
        { error: 'Giveaway not found' },
        { status: 404 }
      )
    }

    // Check permissions: owner OR admin
    const isOwner = giveaway.user_id === user.id
    const isAdmin = ['admin', 'superadmin'].includes(userData.role)

    if (!isOwner && !isAdmin) {
      console.warn(`Unauthorized delete attempt by user ${user.id} for giveaway ${giveawayId}`)
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to delete this giveaway.' },
        { status: 403 }
      )
    }

    // Soft delete (set deleted_at timestamp)
    const { error: deleteError } = await supabase
      .from('giveaways')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', giveawayId)

    if (deleteError) {
      console.error('Error deleting giveaway:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete giveaway' },
        { status: 500 }
      )
    }

    console.log(`Giveaway ${giveawayId} deleted by user ${user.id} (${isAdmin ? 'admin' : 'owner'})`)

    return NextResponse.json(
      { 
        success: true, 
        message: 'Giveaway deleted successfully' 
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error in delete giveaway route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
