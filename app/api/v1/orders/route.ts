import { NextRequest } from 'next/server'
import { createClient } from '@/supabase/server'
import {
  verifyUserRole,
  errorResponse,
  successResponse,
} from '@/lib/api-security'
import { orderQuerySchema } from '@/lib/validation/store'

/**
 * GET /api/v1/orders
 * List orders (users see own, admins see all)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // 1. Authentication check
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return errorResponse('Unauthorized', 401)
    }

    // 2. Validate query parameters
    const queryValidation = orderQuerySchema.safeParse({
      status: searchParams.get('status'),
      payment_status: searchParams.get('payment_status'),
      page: searchParams.get('page') || '1',
      per_page: searchParams.get('per_page') || '20',
    })

    if (!queryValidation.success) {
      return errorResponse('Invalid query parameters', 400, queryValidation.error.errors)
    }

    const { status, payment_status, page, per_page } = queryValidation.data

    // 3. Check if user is admin
    const { authorized: isAdmin } = await verifyUserRole(user.id, ['admin', 'superadmin'])

    // 4. Build query
    let query = supabase
      .from('orders')
      .select(`
        *,
        products (
          id,
          name,
          slug,
          image_url,
          category
        )
      `, { count: 'exact' })
      .order('created_at', { ascending: false })

    // Users can only see their own orders (by email)
    if (!isAdmin) {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (authUser?.email) {
        query = query.eq('customer_email', authUser.email)
      } else {
        return errorResponse('User email not found', 400)
      }
    }

    // Apply filters
    if (status) {
      query = query.eq('status', status)
    }

    if (payment_status) {
      query = query.eq('payment_status', payment_status)
    }

    // Apply pagination
    const from = (page - 1) * per_page
    const to = from + per_page - 1
    query = query.range(from, to)

    const { data: orders, error, count } = await query

    if (error) {
      console.error('Error fetching orders:', error)
      return errorResponse('Failed to fetch orders', 500)
    }

    return successResponse({
      orders: orders || [],
      pagination: {
        page,
        per_page,
        total: count || 0,
        total_pages: Math.ceil((count || 0) / per_page),
      },
    })
  } catch (error) {
    console.error('Error in orders list route:', error)
    return errorResponse('Internal server error', 500)
  }
}
