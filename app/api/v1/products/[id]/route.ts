import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/supabase/server'
import {
  validateRequest,
  verifyUserRole,
  errorResponse,
  successResponse,
  validateRequestSize,
  validateNumericId,
} from '@/lib/api-security'
import { updateProductSchema } from '@/lib/validation/store'
import { checkRateLimit, getClientIdentifier } from '@/lib/ddos-protection'
import { csrf } from '@/lib/csrf'

/**
 * GET /api/v1/products/[id]
 * Get a single product
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Validate ID
    const idValidation = validateNumericId(id)
    if (!idValidation.valid) {
      return idValidation.error
    }

    const supabase = await createClient()

    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', idValidation.value)
      .is('deleted_at', null)
      .single()

    if (error || !product) {
      return errorResponse('Product not found', 404)
    }

    // Non-admins can only see active products
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const { authorized } = await verifyUserRole(user.id, ['admin', 'superadmin'])
      if (!authorized && !product.is_active) {
        return errorResponse('Product not found', 404)
      }
    } else if (!product.is_active) {
      return errorResponse('Product not found', 404)
    }

    return successResponse({ product })
  } catch (error) {
    console.error('Error fetching product:', error)
    return errorResponse('Internal server error', 500)
  }
}

/**
 * PATCH /api/v1/products/[id]
 * Update a product (admin only)
 */
export const PATCH = csrf.withProtection(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    try {
      const { id } = params

      // 1. Validate ID
      const idValidation = validateNumericId(id)
      if (!idValidation.valid) {
        return idValidation.error
      }

      // 2. Request size validation
      const sizeError = validateRequestSize(request, 512000)
      if (sizeError) return sizeError

      // 3. Authentication check
      const supabase = await createClient()
      const { data: { user }, error: authError } = await supabase.auth.getUser()

      if (authError || !user) {
        return errorResponse('Unauthorized', 401)
      }

      // 4. Role verification
      const { authorized } = await verifyUserRole(user.id, ['admin', 'superadmin'])

      if (!authorized) {
        return errorResponse('Forbidden. Admin access required.', 403)
      }

      // 5. Rate limiting
      const identifier = await getClientIdentifier()
      const rateLimit = await checkRateLimit(`${identifier}:update_product`, {
        maxRequests: 20,
        windowMs: 3600000,
        blockDurationMs: 3600000,
      })

      if (!rateLimit.allowed) {
        return errorResponse('Too many requests', 429)
      }

      // 6. Input validation
      const validation = await validateRequest(request, updateProductSchema)
      if (!validation.success) {
        return validation.error
      }

      const updateData = validation.data

      // 7. Check product exists and not deleted
      const { data: existingProduct, error: fetchError } = await supabase
        .from('products')
        .select('id, slug')
        .eq('id', idValidation.value)
        .is('deleted_at', null)
        .single()

      if (fetchError || !existingProduct) {
        return errorResponse('Product not found', 404)
      }

      // 8. If slug is being updated, check for duplicates
      if (updateData.slug && updateData.slug !== existingProduct.slug) {
        const { data: duplicateSlug } = await supabase
          .from('products')
          .select('id')
          .eq('slug', updateData.slug)
          .neq('id', idValidation.value)
          .is('deleted_at', null)
          .single()

        if (duplicateSlug) {
          return errorResponse('A product with this slug already exists', 409)
        }
      }

      // 9. Update product
      const { data: updatedProduct, error: updateError } = await supabase
        .from('products')
        .update({
          ...updateData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', idValidation.value)
        .select()
        .single()

      if (updateError) {
        console.error('Error updating product:', updateError)
        return errorResponse('Failed to update product', 500)
      }

      return successResponse({
        product: updatedProduct,
        message: 'Product updated successfully',
      })
    } catch (error) {
      console.error('Error in update product route:', error)
      return errorResponse('Internal server error', 500)
    }
  }
)

/**
 * DELETE /api/v1/products/[id]
 * Soft delete a product (admin only)
 */
export const DELETE = csrf.withProtection(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    try {
      const { id } = params

      // 1. Validate ID
      const idValidation = validateNumericId(id)
      if (!idValidation.valid) {
        return idValidation.error
      }

      // 2. Authentication check
      const supabase = await createClient()
      const { data: { user }, error: authError } = await supabase.auth.getUser()

      if (authError || !user) {
        return errorResponse('Unauthorized', 401)
      }

      // 3. Role verification
      const { authorized } = await verifyUserRole(user.id, ['admin', 'superadmin'])

      if (!authorized) {
        return errorResponse('Forbidden. Admin access required.', 403)
      }

      // 4. Rate limiting
      const identifier = await getClientIdentifier()
      const rateLimit = await checkRateLimit(`${identifier}:delete_product`, {
        maxRequests: 10,
        windowMs: 3600000,
        blockDurationMs: 3600000,
      })

      if (!rateLimit.allowed) {
        return errorResponse('Too many requests', 429)
      }

      // 5. Check product exists
      const { data: existingProduct } = await supabase
        .from('products')
        .select('id')
        .eq('id', idValidation.value)
        .is('deleted_at', null)
        .single()

      if (!existingProduct) {
        return errorResponse('Product not found', 404)
      }

      // 6. Soft delete (set deleted_at)
      const { error: deleteError } = await supabase
        .from('products')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', idValidation.value)

      if (deleteError) {
        console.error('Error deleting product:', deleteError)
        return errorResponse('Failed to delete product', 500)
      }

      return successResponse({
        message: 'Product deleted successfully',
      })
    } catch (error) {
      console.error('Error in delete product route:', error)
      return errorResponse('Internal server error', 500)
    }
  }
)
