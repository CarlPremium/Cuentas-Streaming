/**
 * SECURE VERSION - Select Giveaway Winner API Route
 * 
 * This is the improved version with all security enhancements.
 * To activate: rename this file to route.ts (backup the old one first)
 */

import { NextRequest } from 'next/server'
import { createClient } from '@/supabase/server'
import { getUserAPI } from '@/queries/server/users'
import {
  validateNumericId,
  verifyUserRole,
  sanitizeError,
  generateRequestId,
  errorResponse,
  successResponse,
} from '@/lib/api-security'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const requestId = generateRequestId()
  
  try {
    // 1. Validate ID parameter
    const { id } = await params
    const idValidation = validateNumericId(id)
    if (!idValidation.valid) {
      return idValidation.error
    }
    const giveawayId = idValidation.value

    // 2. Authenticate user
    const { user } = await getUserAPI()
    if (!user) {
      console.warn(`[${requestId}] Unauthorized access attempt`)
      return errorResponse('Unauthorized', 401)
    }

    // 3. Get giveaway details
    const supabase = await createClient()
    const { data: giveaway, error: giveawayError } = await supabase
      .from('giveaways')
      .select('user_id, title, status')
      .eq('id', giveawayId)
      .single()

    if (giveawayError || !giveaway) {
      console.warn(`[${requestId}] Giveaway not found: ${giveawayId}`)
      return errorResponse('Giveaway not found', 404)
    }

    // 4. Check ownership
    const isOwner = giveaway.user_id === user.id

    // 5. Verify admin role from database (not from client)
    const roleCheck = await verifyUserRole(user.id, ['admin', 'superadmin'])
    const isAdmin = roleCheck.authorized

    // 6. Authorization check
    if (!isOwner && !isAdmin) {
      console.warn(`[${requestId}] Forbidden access attempt by user ${user.id} for giveaway ${giveawayId}`)
      return errorResponse(
        'You do not have permission to select a winner for this giveaway',
        403
      )
    }

    // 7. Validate giveaway status
    if (giveaway.status !== 'ended' && giveaway.status !== 'running') {
      return errorResponse(
        'Winner can only be selected for ended or running giveaways',
        400
      )
    }

    // 8. Select winner using database function
    const { data, error } = await supabase.rpc('select_giveaway_winner', {
      p_giveaway_id: giveawayId,
    })

    if (error) {
      const sanitized = sanitizeError(
        error,
        `${requestId}:SELECT_WINNER`,
        'Failed to select winner'
      )
      return errorResponse(sanitized.message, 500)
    }

    const result = data as {
      success: boolean
      error?: string
      winner_id?: string
      winner_guest_id?: string
      winner_email?: string
      winner_name?: string
    }

    if (!result.success) {
      console.warn(`[${requestId}] Winner selection failed:`, result.error)
      return errorResponse(result.error || 'Failed to select winner', 400)
    }

    // 9. Success response
    console.info(`[${requestId}] Winner selected for giveaway ${giveawayId}`)
    
    return successResponse({
      success: true,
      winner_id: result.winner_id,
      winner_guest_id: result.winner_guest_id,
      winner_email: result.winner_email,
      winner_name: result.winner_name,
      giveaway_title: giveaway.title,
      request_id: requestId,
    })

  } catch (error) {
    const sanitized = sanitizeError(
      error,
      `${requestId}:UNEXPECTED_ERROR`,
      'An unexpected error occurred'
    )
    return errorResponse(sanitized.message, 500)
  }
}

