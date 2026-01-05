import { NextRequest } from 'next/server'
import { createClient } from '@/supabase/server'
import { errorResponse, successResponse } from '@/lib/api-security'

/**
 * GET /api/v1/categories
 * Get all product categories (public)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: categories, error } = await supabase
      .from('product_categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Error fetching categories:', error)
      return errorResponse('Failed to fetch categories', 500)
    }

    return successResponse({
      categories: categories || [],
    })
  } catch (error) {
    console.error('Error in categories route:', error)
    return errorResponse('Internal server error', 500)
  }
}
