import { NextResponse, type NextRequest } from 'next/server'
import { createClient, createAdminClient } from '@/supabase/server'
import {
  ApiError,
  getMetaValue,
  compareMetaValue,
} from '@/lib/utils'
import { revalidates } from '@/lib/utils/cache'
import { authorize } from '@/queries/server/auth'
import { getUserAPI } from '@/queries/server/users'
import { type UserMeta } from '@/types/database'
import { z } from 'zod'

import dayjs from 'dayjs'

// SECURITY FIX #1: Input validation schemas
const usernameSchema = z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/)
const userUpdateSchema = z.object({
  username: usernameSchema.optional(),
  full_name: z.string().max(100).optional(),
  bio: z.string().max(500).optional(),
  avatar_url: z.string().url().max(500).optional().or(z.literal('')),
  website: z.string().url().max(200).optional().or(z.literal('')),
  location: z.string().max(100).optional(),
}).passthrough() // Allow other fields for backward compatibility

const userMetaSchema = z.object({
  id: z.number().optional(),
  user_id: z.string().uuid(),
  meta_key: z.string().min(1).max(100).regex(/^[a-z0-9_]+$/),
  meta_value: z.string().max(5000),
})

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get('id') as string
  const username = searchParams.get('username') as string

  let match: Record<string, any> = {}

  if (id) match = { ...match, id }
  if (username) match = { ...match, username }

  const supabase = await createClient()
  const { data: user, error } = await supabase
    .from('users')
    .select('*, meta:usermeta(*)')
    .match(match)
    .maybeSingle()

  if (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json({ data: null, error: { message: 'Failed to fetch user' } }, { status: 400 })
  }

  return user
    ? NextResponse.json({ data: user, error: null })
    : NextResponse.json({ data: null, error: null })
}

export async function POST(request: NextRequest) {
  try {
    // SECURITY FIX #5: Request size limit
    const contentLength = request.headers.get('content-length')
    if (contentLength && parseInt(contentLength) > 102400) { // 100KB
      return NextResponse.json(
        { data: null, error: { message: 'Request too large' } },
        { status: 413 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id') as string

    const body = await request.json()
    const { data, options } = body
    
    // SECURITY FIX #1: Validate input
    const { meta, ...formData } = data
    const validationResult = userUpdateSchema.safeParse(formData)
    
    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0]
      return NextResponse.json(
        { data: null, error: { message: firstError?.message || 'Invalid input' } },
        { status: 400 }
      )
    }

    const validatedData = validationResult.data
    
    const { authorized } = await authorize(id)
    const { user } = await getUserAPI(id)

    if (!authorized || !user) {
      return NextResponse.json(
        { data: null, error: new ApiError(401) },
        { status: 401 }
      )
    }

    if (validatedData?.username && user?.username_changed_at) {
      const now = dayjs()
      const startDate = dayjs(user?.username_changed_at)
      const endDate = startDate.add(1, 'month')
      if (now < endDate) {
        const diff = endDate.diff(now, 'days')
        const error = `You can change it after ${diff} days.`
        return NextResponse.json(
          { data: null, error: new ApiError(403, error) },
          { status: 403 }
        )
      }
    }

    const supabase = await createClient()
    const { data: old } = await supabase
      .from('users')
      .select('*, meta:usermeta(*)')
      .eq('id', id)
      .single()

    // SECURITY FIX #1: Validate meta if present
    if (Array.isArray(meta) && meta?.length > 0) {
      for (const m of meta) {
        const metaValidation = userMetaSchema.safeParse({ ...m, user_id: id })
        if (!metaValidation.success) {
          return NextResponse.json(
            { data: null, error: { message: 'Invalid meta data' } },
            { status: 400 }
          )
        }
      }

      const denies: string[] = []

      const newMetas: UserMeta[] = meta
        ?.filter((r: UserMeta) => !denies.includes(r.meta_key))
        ?.filter((r: UserMeta) => !r.id)

      if (Array.isArray(newMetas) && newMetas?.length > 0) {
        const { error } = await supabase.from('usermeta').insert(newMetas)
        if (error) {
          console.error('Error inserting meta:', error)
          return NextResponse.json({ data: null, error: { message: 'Failed to update metadata' } }, { status: 400 })
        }
      }

      const metas: UserMeta[] = meta
        ?.filter((r: UserMeta) => !denies.includes(r.meta_key))
        ?.filter((r: UserMeta) => r.id)
        ?.filter((r: UserMeta) => !compareMetaValue(old?.meta, r, r.meta_key))

      if (Array.isArray(metas) && metas?.length > 0) {
        const { error } = await supabase.from('usermeta').upsert(metas)
        if (error) {
          console.error('Error updating meta:', error)
          return NextResponse.json({ data: null, error: { message: 'Failed to update metadata' } }, { status: 400 })
        }
      }
    }

    // Update username_changed_at if username is being changed
    const updateData = { ...validatedData }
    if (validatedData.username && old && validatedData.username !== old.username) {
      updateData.username_changed_at = new Date().toISOString()
    }

    const { data: newUser, error } = await supabase
      .from('users')
      .update(updateData as any)
      .eq('id', id)
      .select('*, meta:usermeta(*)')
      .single()

    if (error) {
      console.error('Error updating user:', error)
      // SECURITY FIX #7: Sanitized error message
      if (error.code === '23505') {
        return NextResponse.json({ data: null, error: { message: 'Username already taken' } }, { status: 409 })
      }
      return NextResponse.json({ data: null, error: { message: 'Failed to update user' } }, { status: 400 })
    }

    return NextResponse.json({
      data: newUser,
      error: null,
      revalidated: revalidates(options),
      now: Date.now(),
    })
  } catch (error) {
    console.error('Unexpected error in user update:', error)
    return NextResponse.json(
      { data: null, error: { message: 'An error occurred' } },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id') as string

    const { options } = await request.json()
    const { authorized } = await authorize(id)

    if (!authorized) {
      return NextResponse.json(
        { data: null, error: new ApiError(401) },
        { status: 401 }
      )
    }

    const supabase = await createClient()
    const bucketId = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET!
    const { data: list } = await supabase.storage.from(bucketId).list(id)

    if (Array.isArray(list) && list?.length > 0) {
      const files = list.map((file) => `${id}/${file?.name}`)
      const removed = await supabase.storage.from(bucketId).remove(files)
      if (removed?.error) {
        console.error('Error removing files:', removed.error)
        // Continue with deletion even if file removal fails
      }
    }

    const supabaseAdmin = createAdminClient()
    const account = await supabaseAdmin.deleteUser(id)

    if (account?.error) {
      console.error('Error deleting user:', account.error)
      return NextResponse.json(
        { data: null, error: { message: 'Failed to delete account' } },
        { status: 400 }
      )
    }

    return NextResponse.json({
      data: null,
      error: null,
      revalidated: revalidates(options),
      now: Date.now(),
    })
  } catch (error) {
    console.error('Unexpected error in user deletion:', error)
    return NextResponse.json(
      { data: null, error: { message: 'An error occurred' } },
      { status: 500 }
    )
  }
}
