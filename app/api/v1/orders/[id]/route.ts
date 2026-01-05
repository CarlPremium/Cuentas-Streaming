import { NextRequest } from 'next/server'
import { createClient } from '@/supabase/server'
import {
  validateRequest,
  verifyUserRole,
  errorResponse,
  successResponse,
  validateRequestSize,
  validateNumericId,
} from '@/lib/api-security'
import { updateOrderSchema } from '@/lib/validation/store'
import { checkRateLimit, getClientIdentifier } from '@/lib/ddos-protection'
import { csrf } from '@/lib/csrf'

/**
 * GET /api/v1/orders/[id]
 * Get a single order
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // 3. Fetch order
    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        products (
          id,
          name,
          slug,
          image_url,
          category,
          duration
        )
      `)
      .eq('id', idValidation.value)
      .single()

    if (error || !order) {
      return errorResponse('Order not found', 404)
    }

    // 4. Authorization check
    const { authorized: isAdmin } = await verifyUserRole(user.id, ['admin', 'superadmin'])

    // Users can only see their own orders
    if (!isAdmin && order.customer_email !== user.email) {
      return errorResponse('Forbidden', 403)
    }

    return successResponse({ order })
  } catch (error) {
    console.error('Error fetching order:', error)
    return errorResponse('Internal server error', 500)
  }
}

/**
 * PATCH /api/v1/orders/[id]
 * Update order status (admin only)
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
      const sizeError = validateRequestSize(request, 102400) // 100KB
      if (sizeError) return sizeError

      // 3. Authentication check
      const supabase = await createClient()
      const { data: { user }, error: authError } = await supabase.auth.getUser()

      if (authError || !user) {
        return errorResponse('Unauthorized', 401)
      }

      // 4. Role verification (admin only)
      const { authorized } = await verifyUserRole(user.id, ['admin', 'superadmin'])

      if (!authorized) {
        return errorResponse('Forbidden. Admin access required.', 403)
      }

      // 5. Rate limiting
      const identifier = await getClientIdentifier()
      const rateLimit = await checkRateLimit(`${identifier}:update_order`, {
        maxRequests: 30,
        windowMs: 3600000,
        blockDurationMs: 3600000,
      })

      if (!rateLimit.allowed) {
        return errorResponse('Too many requests', 429)
      }

      // 6. Input validation
      const validation = await validateRequest(request, updateOrderSchema)
      if (!validation.success) {
        return validation.error
      }

      const updateData = validation.data

      // 7. Check order exists
      const { data: existingOrder, error: fetchError } = await supabase
        .from('orders')
        .select('id, status, payment_status, delivery_status')
        .eq('id', idValidation.value)
        .single()

      if (fetchError || !existingOrder) {
        return errorResponse('Order not found', 404)
      }

      // 8. Validate status transitions
      if (updateData.status) {
        // Can't reopen completed orders
        if (existingOrder.status === 'completed' && updateData.status === 'pending') {
          return errorResponse('Cannot reopen completed orders', 400)
        }

        // Can't cancel completed orders
        if (existingOrder.status === 'completed' && updateData.status === 'cancelled') {
          return errorResponse('Cannot cancel completed orders', 400)
        }
      }

      // 9. Auto-update delivery status based on order status
      if (updateData.status === 'completed' && !updateData.delivery_status) {
        updateData.delivery_status = 'delivered'
      }

      // 10. Update order
      const { data: updatedOrder, error: updateError } = await supabase
        .from('orders')
        .update({
          ...updateData,
          updated_at: new Date().toISOString(),
          processed_by: user.id,
          ...(updateData.delivery_status === 'delivered' && !existingOrder.delivered_at
            ? { delivered_at: new Date().toISOString() }
            : {}),
        })
        .eq('id', idValidation.value)
        .select(`
          *,
          products (
            id,
            name,
            slug,
            image_url
          )
        `)
        .single()

      if (updateError) {
        console.error('Error updating order:', updateError)
        return errorResponse('Failed to update order', 500)
      }

      return successResponse({
        order: updatedOrder,
        message: 'Order updated successfully',
      })
    } catch (error) {
      console.error('Error in update order route:', error)
      return errorResponse('Internal server error', 500)
    }
  }
)
