import { NextRequest } from 'next/server'
import { createClient } from '@/supabase/server'
import {
  validateRequest,
  verifyUserRole,
  errorResponse,
  successResponse,
  validateRequestSize,
} from '@/lib/api-security'
import { updateStoreSettingsSchema } from '@/lib/validation/store'
import { checkRateLimit, getClientIdentifier } from '@/lib/ddos-protection'
import { csrf } from '@/lib/csrf'

/**
 * GET /api/v1/store/settings
 * Get store settings (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    // 1. Authentication check
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return errorResponse('Unauthorized', 401)
    }

    // 2. Role verification (admin or superadmin)
    const { authorized } = await verifyUserRole(user.id, ['admin', 'superadmin'])

    if (!authorized) {
      return errorResponse('Forbidden. Admin access required.', 403)
    }

    // 3. Fetch settings
    const { data: settings, error } = await supabase
      .from('store_settings')
      .select('*')
      .single()

    if (error) {
      console.error('Error fetching store settings:', error)
      return errorResponse('Failed to fetch store settings', 500)
    }

    return successResponse({ settings })
  } catch (error) {
    console.error('Error in store settings route:', error)
    return errorResponse('Internal server error', 500)
  }
}

/**
 * PATCH /api/v1/store/settings
 * Update store settings (superadmin only for security)
 */
export const PATCH = csrf.withProtection(async (request: NextRequest) => {
  try {
    // 1. Request size validation
    const sizeError = validateRequestSize(request, 102400) // 100KB
    if (sizeError) return sizeError

    // 2. Authentication check
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return errorResponse('Unauthorized', 401)
    }

    // 3. Role verification (SUPERADMIN ONLY for sensitive settings)
    const { authorized, role } = await verifyUserRole(user.id, ['superadmin'])

    if (!authorized) {
      return errorResponse('Forbidden. SuperAdmin access required.', 403)
    }

    // 4. Rate limiting (strict for settings)
    const identifier = await getClientIdentifier()
    const rateLimit = await checkRateLimit(`${identifier}:update_store_settings`, {
      maxRequests: 3,
      windowMs: 3600000, // 1 hour
      blockDurationMs: 7200000, // 2 hours block
    })

    if (!rateLimit.allowed) {
      return errorResponse('Too many requests. Settings can only be updated 3 times per hour.', 429)
    }

    // 5. Input validation
    const validation = await validateRequest(request, updateStoreSettingsSchema)
    if (!validation.success) {
      return validation.error
    }

    const updateData = validation.data

    // 6. Update settings
    const { data: updatedSettings, error: updateError } = await supabase
      .from('store_settings')
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', 1) // Assuming single settings row
      .select()
      .single()

    if (updateError) {
      console.error('Error updating store settings:', updateError)
      return errorResponse('Failed to update store settings', 500)
    }

    return successResponse({
      settings: updatedSettings,
      message: 'Store settings updated successfully',
    })
  } catch (error) {
    console.error('Error in update store settings route:', error)
    return errorResponse('Internal server error', 500)
  }
})
