import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/supabase/server'

/**
 * Cron job to auto-end expired giveaways
 * SECURITY FIX #10: Improved authentication
 */
export async function GET(request: NextRequest) {
  try {
    // SECURITY FIX #10: Better cron authentication
    const authHeader = request.headers.get('authorization')
    const cronHeader = request.headers.get('x-vercel-cron') // Vercel adds this
    
    // In production with Vercel Cron, check the x-vercel-cron header
    // In development or other environments, use Bearer token
    const isVercelCron = process.env.VERCEL_ENV === 'production' && cronHeader
    const isBearerAuth = authHeader === `Bearer ${process.env.CRON_SECRET}`
    
    if (!isVercelCron && !isBearerAuth) {
      console.warn('Unauthorized cron attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()

    // Auto-end expired giveaways
    const { error: endError } = await supabase.rpc('auto_end_expired_giveaways')
    if (endError) {
      console.error('Error ending giveaways:', endError)
    }

    // Cleanup rate limits
    const { error: cleanupError } = await supabase.rpc(
      'cleanup_old_rate_limits'
    )
    if (cleanupError) {
      console.error('Error cleaning up rate limits:', cleanupError)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in cron job:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
