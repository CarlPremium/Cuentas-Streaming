'use client'

import * as React from 'react'
import { useCookieConsent } from '@/hooks/use-cookie-consent'
import { cn } from '@/lib/utils'

interface LinkvertiseAdProps {
  width?: number
  height?: number
  className?: string
}

export function LinkvertiseAd({ 
  width = 728, 
  height = 90, 
  className 
}: LinkvertiseAdProps) {
  const { consent } = useCookieConsent()

  // Don't show ads if user rejected cookies
  if (consent === 'rejected') return null

  // Show placeholder while waiting for consent
  if (consent === null) {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-lg border border-border/50 bg-muted/30',
          className
        )}
        style={{ width, height }}
      >
        <span className="text-xs text-muted-foreground">Cargando...</span>
      </div>
    )
  }

  return (
    <div
      className={cn('linkvertise-ad-container mx-auto', className)}
      style={{ 
        position: 'relative',
        width: width,
        maxWidth: '100%',
        height: height,
      }}
    >
      <iframe
        src="https://publisher.linkvertise.com/cdn/ads/LV-728x90/index.html"
        frameBorder="0"
        height={height}
        width={width}
        style={{
          border: 'none',
          display: 'block',
          maxWidth: '100%',
        }}
        title="Linkvertise Ad"
      />
      <a
        href="https://publisher.linkvertise.com/ac/1368950"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        }}
        aria-label="Ad Link"
      />
    </div>
  )
}
