import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/supabase/server'
import { getUserAPI } from '@/queries/server/users'
import { checkRateLimit, getClientIdentifier } from '@/lib/ddos-protection'

/**
 * Get all giveaways with filtering and pagination
 * GET /api/v1/giveaway
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'active'
    const featured = searchParams.get('featured')
    const page = parseInt(searchParams.get('page') || '1')
    const perPage = parseInt(searchParams.get('per_page') || '20')

    const supabase = await createClient()

    let query = supabase
      .from('giveaways')
      .select(`
        *,
        users!giveaways_user_id_fkey(username, full_name, avatar_url),
        giveaway_participants(count)
      `, { count: 'exact' })
      .is('deleted_at', null)
      .eq('is_banned', false)
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })
      .range((page - 1) * perPage, page * perPage - 1)

    // Filter by status
    if (status === 'active') {
      query = query.in('status', ['active', 'running'])
    } else {
      query = query.eq('status', status)
    }

    // Filter by featured
    if (featured === 'true') {
      query = query.eq('is_featured', true)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching giveaways:', error)
      return NextResponse.json(
        { error: 'Failed to fetch giveaways' },
        { status: 500 }
      )
    }

    // Transform data to include participant count
    const transformedData = (data || []).map((giveaway) => ({
      ...giveaway,
      participant_count: giveaway.giveaway_participants?.[0]?.count || 0,
    }))

    return NextResponse.json({
      giveaways: transformedData,
      pagination: {
        page,
        per_page: perPage,
        total: count || 0,
        total_pages: Math.ceil((count || 0) / perPage),
      },
    })

  } catch (error) {
    console.error('Error in giveaways list route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Create a new giveaway (admin only)
 * POST /api/v1/giveaway
 */
export async function POST(request: NextRequest) {
  try {
    const { user } = await getUserAPI()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const supabase = await createClient()
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!userData || !['admin', 'superadmin'].includes(userData.role)) {
      return NextResponse.json(
        { error: 'Forbidden. Admin access required.' },
        { status: 403 }
      )
    }

    // Rate limiting
    const identifier = await getClientIdentifier()
    const rateLimit = await checkRateLimit(`${identifier}:create_giveaway`, {
      maxRequests: 5,
      windowMs: 3600000, // 1 hour
      blockDurationMs: 3600000,
    })

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(rateLimit.resetAt).toISOString(),
          },
        }
      )
    }

    const body = await request.json()
    const {
      title,
      description,
      thumbnail_url,
      start_date,
      end_date,
      max_participants,
      is_featured,
      allow_guests,
      require_email,
    } = body

    // Validation
    if (!title || !end_date) {
      return NextResponse.json(
        { error: 'Title and end_date are required' },
        { status: 400 }
      )
    }

    const endDate = new Date(end_date)
    if (endDate <= new Date()) {
      return NextResponse.json(
        { error: 'End date must be in the future' },
        { status: 400 }
      )
    }

    // Generate slug
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      + '-' + Date.now()

    // Create giveaway
    const { data: giveaway, error } = await supabase
      .from('giveaways')
      .insert({
        user_id: user.id,
        title,
        slug,
        description,
        thumbnail_url,
        start_date: start_date || new Date().toISOString(),
        end_date: endDate.toISOString(),
        max_participants,
        is_featured: is_featured || false,
        allow_guests: allow_guests ?? true,
        require_email: require_email ?? false,
        status: 'active',
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating giveaway:', error)
      return NextResponse.json(
        { error: 'Failed to create giveaway' },
        { status: 500 }
      )
    }

    return NextResponse.json(giveaway, { status: 201 })

  } catch (error) {
    console.error('Error in create giveaway route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
