import * as React from 'react'
import type { Metadata, ResolvingMetadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { getUserAPI } from '@/queries/server/users'

// Redirect favorites to main profile
export default async function FavoritesPage({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params
  const { user } = await getUserAPI(null, { username })

  if (!user) notFound()

  // Redirect to main profile page
  redirect(`/${username}`)
}
