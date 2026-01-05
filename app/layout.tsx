import * as React from 'react'
import type { Metadata, Viewport } from 'next'
import { cookies } from 'next/headers'
import { Analytics } from '@vercel/analytics/react'
import { Space_Grotesk, Outfit } from 'next/font/google'

import { Toaster } from '@/components/ui/sonner'
import { TailwindIndicator } from '@/components/tailwind-indicator'
import { TrackingScripts } from '@/components/seo/tracking-scripts'
import { JsonLd } from '@/components/seo/json-ld'
import { CookieBanner } from '@/components/cookie-banner'
import { ExitIntentPopup } from '@/components/exit-intent-popup'

import { AppProvider } from '@/context/app-provider'
import { I18nProvider } from '@/context/i18n-provider'
import { ThemeProvider } from '@/context/theme-provider'

import { cn, getBaseUrl } from '@/lib/utils'
import { siteConfig } from '@/config/site'
import { defaultLng } from '@/i18next.config'

import './globals.css'

// Optimize font loading with next/font
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-heading',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'blog',
    'contenido',
    'sorteos',
    'giveaways',
    'streaming',
    'cuentas',
    'publicaciones',
    'comunidad',
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  manifest: '/manifest.json',
  robots: {
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
    type: 'website',
    locale: 'es_ES',
    url: getBaseUrl(),
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: `${getBaseUrl()}/og-image.png`,
        width: 1200,
        height: 630,
        alt: siteConfig.title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [`${getBaseUrl()}/og-image.png`],
    creator: '@cuentasstreaming',
    site: '@cuentasstreaming',
  },
  alternates: {
    canonical: getBaseUrl(),
  },
  verification: {
    google: 'IxvN4WdPU9_KS-Tte2fenLPbVODRkNwhyqrXGx2rAJw',
    // other: { 'naver-site-verification': '' },
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children?: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const language = cookieStore.get('app:language')?.value || defaultLng
  const theme = cookieStore.get('app:theme')?.value || 'system'

  return (
    <html lang={language} suppressHydrationWarning>
      <head>
        <JsonLd type="website" />
        <TrackingScripts
          clarityProjectId={process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID}
        />
      </head>
      <body className={cn('font-sans antialiased', spaceGrotesk.variable, outfit.variable)}>
        <AppProvider>
          <I18nProvider value={{ language }}>
            <ThemeProvider value={{ theme }}>
              <div id="__next">{children}</div>
              <Toaster richColors closeButton />
              <TailwindIndicator />
              <CookieBanner />
              <ExitIntentPopup />
              {process.env.NODE_ENV === 'production' ? <Analytics /> : null}
            </ThemeProvider>
          </I18nProvider>
        </AppProvider>
      </body>
    </html>
  )
}
