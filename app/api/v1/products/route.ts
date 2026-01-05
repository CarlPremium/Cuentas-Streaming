import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/supabase/server'
import {
  validateRequest,
  verifyUserRole,
  errorResponse,
  successResponse,
  validateRequestSize,
  addSecurityHeaders,
} from '@/lib/api-security'
import { createProductSchema, productQuerySchema } from '@/lib/validation/store'
import { checkRateLimit, getClientIdentifier } from '@/lib/ddos-protection'
import { csrf } from '@/lib/csrf'

/**
 * GET /api/v1/products
 * List all products (public)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Validate query parameters
    const queryValidation = productQuerySchema.safeParse({
      category: searchParams.get('category'),
      is_featured: searchParams.get('is_featured'),
      is_active: searchParams.get('is_active'),
      page: searchParams.get('page') || '1',
      per_page: searchParams.get('per_page') || '20',
      sort: searchParams.get('sort') || 'sort_order',
      order: searchParams.get('order') || 'asc',
    })

    if (!queryValidation.success) {
      return errorResponse('Invalid query parameters', 400, queryValidation.error.errors)
    }

    const { category, is_featured, is_active, page, per_page, sort, order } = queryValidation.data

    const supabase = await createClient()

    // Build query
    let query = supabase
      .from('products')
      .select('*', { count: 'exact' })
      .is('deleted_at', null)

    // Apply filters
    if (is_active !== undefined) {
      query = query.eq('is_active', is_active)
    } else {
      // Default: only active products for public
      query = query.eq('is_active', true)
    }

    if (category) {
      query = query.eq('category', category)
    }

    if (is_featured !== undefined) {
      query = query.eq('is_featured', is_featured)
    }

    // Apply sorting
    query = query.order(sort, { ascending: order === 'asc' })

    // Apply pagination
    const from = (page - 1) * per_page
    const to = from + per_page - 1
    query = query.range(from, to)

    const { data: products, error, count } = await query

    if (error) {
      console.error('Error fetching products:', error)
      return errorResponse('Failed to fetch products', 500)
    }

    return successResponse({
      products: products || [],
      pagination: {
        page,
        per_page,
        total: count || 0,
        total_pages: Math.ceil((count || 0) / per_page),
      },
    })
  } catch (error) {
    console.error('Error in products list route:', error)
    return errorResponse('Internal server error', 500)
  }
}

/**
 * POST /api/v1/products
 * Create a new product (admin only)
 */
export const POST = csrf.withProtection(async (request: NextRequest) => {
  try {
    // 1. Request size validation
    const sizeError = validateRequestSize(request, 512000) // 500KB max
    if (sizeError) return sizeError

    // 2. Authentication check
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return errorResponse('Unauthorized', 401)
    }

    // 3. Role verification (admin or superadmin)
    const { authorized, role } = await verifyUserRole(user.id, ['admin', 'superadmin'])

    if (!authorized) {
      return errorResponse('Forbidden. Admin access required.', 403)
    }

    // 4. Rate limiting
    const identifier = await getClientIdentifier()
    const rateLimit = await checkRateLimit(`${identifier}:create_product`, {
      maxRequests: 10,
      windowMs: 3600000, // 1 hour
      blockDurationMs: 3600000,
    })

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(rateLimit.resetAt).toISOString(),
          },
        }
      )
    }

    // 5. Input validation
    const validation = await validateRequest(request, createProductSchema)
    if (!validation.success) {
      return validation.error
    }

    const productData = validation.data

    // 6. Check for duplicate slug
    const { data: existingProduct } = await supabase
      .from('products')
      .select('id')
      .eq('slug', productData.slug)
      .is('deleted_at', null)
      .single()

    if (existingProduct) {
      return errorResponse('A product with this slug already exists', 409)
    }

    // 7. Create product
    const { data: product, error: createError } = await supabase
      .from('products')
      .insert({
        ...productData,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (createError) {
      console.error('Error creating product:', createError)

      if (createError.code === '23505') {
        return errorResponse('Duplicate product slug', 409)
      }

      return errorResponse('Failed to create product', 500)
    }

    return successResponse(
      {
        product,
        message: 'Product created successfully',
      },
      201
    )
  } catch (error) {
    console.error('Error in create product route:', error)
    return errorResponse('Internal server error', 500)
  }
})
