import { Metadata } from 'next'
import { getBaseUrl } from '@/lib/utils'
import { siteConfig } from '@/config/site'

interface GenerateMetadataProps {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: 'website' | 'article' | 'profile'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  keywords?: string
  noIndex?: boolean
}

export function generateSEOMetadata({
  title,
  description,
  image,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  keywords,
  noIndex = false,
}: GenerateMetadataProps = {}): Metadata {
  const baseUrl = getBaseUrl()
  const pageTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.title
  const pageDescription = description || siteConfig.description
  const pageImage = image || `${baseUrl}/og-image.png`
  const pageUrl = url || baseUrl

  const metadata: Metadata = {
    title: pageTitle,
    description: pageDescription,
    keywords: keywords,
    authors: author ? [{ name: author }] : undefined,
    creator: siteConfig.name,
    publisher: siteConfig.name,
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
    openGraph: {
      type: type,
      locale: 'es_ES',
      url: pageUrl,
      title: pageTitle,
      description: pageDescription,
      siteName: siteConfig.name,
      images: [
        {
          url: pageImage,
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
      ...(type === 'article' && publishedTime
        ? {
            publishedTime,
            modifiedTime: modifiedTime || publishedTime,
            authors: author ? [author] : undefined,
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [pageImage],
      creator: '@cuentasstreaming', // Update with your Twitter handle
      site: '@cuentasstreaming', // Update with your Twitter handle
    },
    alternates: {
      canonical: pageUrl,
    },
  }

  return metadata
}

// Helper for blog posts
export function generateBlogPostMetadata({
  title,
  description,
  image,
  slug,
  username,
  publishedTime,
  modifiedTime,
  author,
  keywords,
}: {
  title: string
  description?: string
  image?: string
  slug: string
  username: string
  publishedTime: string
  modifiedTime?: string
  author: string
  keywords?: string
}): Metadata {
  const baseUrl = getBaseUrl()
  const url = `${baseUrl}/${username}/${slug}`

  return generateSEOMetadata({
    title,
    description,
    image,
    url,
    type: 'article',
    publishedTime,
    modifiedTime,
    author,
    keywords,
  })
}

// Helper for user profiles
export function generateProfileMetadata({
  username,
  fullName,
  bio,
  avatar,
}: {
  username: string
  fullName?: string
  bio?: string
  avatar?: string
}): Metadata {
  const baseUrl = getBaseUrl()
  const url = `${baseUrl}/${username}`
  const title = fullName || username
  const description = bio || `Perfil de ${username} en ${siteConfig.name}`

  return generateSEOMetadata({
    title,
    description,
    image: avatar,
    url,
    type: 'profile',
  })
}
