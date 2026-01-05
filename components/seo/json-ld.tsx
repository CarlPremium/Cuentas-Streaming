import Script from 'next/script'
import { getBaseUrl } from '@/lib/utils'
import { siteConfig } from '@/config/site'

interface JsonLdProps {
  type?: 'website' | 'article' | 'profile'
  data?: Record<string, any>
}

export function JsonLd({ type = 'website', data = {} }: JsonLdProps) {
  const baseUrl = getBaseUrl()

  const getStructuredData = () => {
    switch (type) {
      case 'website':
        return {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: siteConfig.name,
          description: siteConfig.description,
          url: baseUrl,
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: `${baseUrl}/search?q={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
          },
          publisher: {
            '@type': 'Organization',
            name: siteConfig.name,
            url: baseUrl,
          },
        }

      case 'article':
        return {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: data.title,
          description: data.description,
          image: data.image || `${baseUrl}/og-image.png`,
          datePublished: data.datePublished,
          dateModified: data.dateModified || data.datePublished,
          author: {
            '@type': 'Person',
            name: data.authorName,
            url: data.authorUrl,
          },
          publisher: {
            '@type': 'Organization',
            name: siteConfig.name,
            url: baseUrl,
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': data.url,
          },
          keywords: data.keywords,
        }

      case 'profile':
        return {
          '@context': 'https://schema.org',
          '@type': 'ProfilePage',
          mainEntity: {
            '@type': 'Person',
            name: data.name,
            description: data.bio,
            image: data.avatar,
            url: data.url,
          },
        }

      default:
        return {}
    }
  }

  const structuredData = getStructuredData()

  return (
    <Script
      id={`json-ld-${type}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  )
}
