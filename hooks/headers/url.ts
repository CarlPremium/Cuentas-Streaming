'use server'

import { headers } from 'next/headers'

export const getUrl = async (): Promise<string> => {
  const headersList = await headers()
  return headersList.get('x-url') as string
}

export const getOrigin = async (): Promise<string> => {
  const headersList = await headers()
  return headersList.get('x-origin') as string
}

export const getPathname = async (): Promise<string> => {
  const headersList = await headers()
  return headersList.get('x-pathname') as string
}
