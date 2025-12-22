'use server'

import { revalidatePath, revalidateTag } from 'next/cache'

export async function revalidates(options: {
  revalidatePaths?: string | string[] | null
  revalidateTags?: string | string[] | null
  [key: string]: any
}): Promise<boolean> {
  let revalidated: boolean = false

  if (options?.revalidatePaths) {
    revalidated = await revalidatePaths(options?.revalidatePaths)
  }

  if (options?.revalidateTags) {
    revalidated = await revalidateTags(options?.revalidateTags)
  }

  return revalidated
}

export async function revalidatePaths(paths?: string | string[] | null): Promise<boolean> {
  let revalidated: boolean = false

  if (Array.isArray(paths) && paths?.length > 0) {
    for (const path of paths) {
      revalidatePath(encodeURI(path))
      revalidated = true
    }
  } else if (typeof paths === 'string') {
    revalidatePath(encodeURI(paths))
    revalidated = true
  }

  return revalidated
}

export async function revalidateTags(tags?: string | string[] | null): Promise<boolean> {
  let revalidated: boolean = false

  if (Array.isArray(tags) && tags?.length > 0) {
    for (const tag of tags) {
      revalidateTag(tag, 'default')
      revalidated = true
    }
  } else if (typeof tags === 'string') {
    revalidateTag(tags, 'default')
    revalidated = true
  }

  return revalidated
}
