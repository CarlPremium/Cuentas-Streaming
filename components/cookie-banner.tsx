'use client'

import * as React from 'react'
import Link from 'next/link'
import { Cookie, X, Check, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCookieConsent } from '@/hooks/use-cookie-consent'
import { cn } from '@/lib/utils'

export function CookieBanner() {
  const { showBanner, acceptCookies, rejectCookies } = useCookieConsent()
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    if (showBanner) {
      // Delay to avoid hydration issues
      const timer = setTimeout(() => setIsVisible(true), 100)
      return () => clearTimeout(timer)
    }
  }, [showBanner])

  if (!showBanner || !isVisible) return null

  const handleAccept = () => {
    acceptCookies()
    setIsVisible(false)
  }

  const handleReject = () => {
    rejectCookies()
    setIsVisible(false)
  }

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6',
        'animate-in slide-in-from-bottom duration-500'
      )}
    >
      <div className="mx-auto max-w-7xl">
        <div className="cookie-banner-card relative overflow-hidden rounded-2xl border border-border/50 bg-card/95 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-accent/10 blur-3xl" />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            {/* Content */}
            <div className="flex flex-1 items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
                <Cookie className="h-6 w-6 text-primary" />
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-foreground">
                    🍪 Usamos Cookies
                  </h3>
                  <Shield className="h-4 w-4 text-primary" />
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Utilizamos cookies para mejorar tu experiencia, analizar el tráfico y personalizar el contenido. 
                  Al continuar navegando, aceptas nuestro uso de cookies.{' '}
                  <Link
                    href="/policy/terms"
                    className="font-medium text-primary underline-offset-4 hover:underline"
                  >
                    Más información
                  </Link>
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReject}
                className="border-border/50 hover:bg-secondary"
              >
                <X className="mr-2 h-4 w-4" />
                Rechazar
              </Button>
              <Button
                size="sm"
                onClick={handleAccept}
                className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90"
              >
                <Check className="mr-2 h-4 w-4" />
                Aceptar Cookies
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
