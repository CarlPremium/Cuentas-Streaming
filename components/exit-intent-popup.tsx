'use client'

import * as React from 'react'
import Link from 'next/link'
import { X, Gift, ShoppingBag, Sparkles, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useExitIntent } from '@/hooks/use-exit-intent'
import { cn } from '@/lib/utils'

export function ExitIntentPopup() {
  const { showExitIntent, closeExitIntent } = useExitIntent()

  if (!showExitIntent) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={closeExitIntent}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 p-4 animate-in zoom-in-95 fade-in duration-300">
        <div className="exit-intent-card relative overflow-hidden rounded-3xl border border-border/50 bg-card shadow-2xl">
          {/* Close Button */}
          <button
            onClick={closeExitIntent}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-secondary/80 text-muted-foreground backdrop-blur-sm transition-all hover:bg-secondary hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
          <div className="absolute -right-32 -top-32 h-64 w-64 rounded-full bg-primary/20 blur-3xl animate-pulse-slow" />
          <div className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-accent/20 blur-3xl animate-pulse-slow" />

          {/* Content */}
          <div className="relative p-8 sm:p-12">
            {/* Icon */}
            <div className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 animate-bounce-gentle">
                <Sparkles className="h-10 w-10 text-primary" />
              </div>
            </div>

            {/* Title */}
            <h2 className="mb-4 text-center text-3xl font-bold text-foreground sm:text-4xl">
              ¡Espera! 🎉
            </h2>
            <p className="mb-8 text-center text-lg text-muted-foreground">
              Antes de irte, descubre nuestras ofertas increíbles
            </p>

            {/* Options */}
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Store Card */}
              <Link
                href="/store"
                onClick={closeExitIntent}
                className="group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-card to-secondary/30 p-6 transition-all hover:scale-105 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative space-y-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
                    <ShoppingBag className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">
                    Tienda Premium
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Cuentas de streaming y gaming hasta 70% OFF
                  </p>
                  <div className="flex items-center gap-2 text-sm font-medium text-primary">
                    Ver ofertas
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>

              {/* Giveaways Card */}
              <Link
                href="/giveaways"
                onClick={closeExitIntent}
                className="group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-card to-secondary/30 p-6 transition-all hover:scale-105 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/20"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative space-y-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent/20 to-primary/20">
                    <Gift className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">
                    Sorteos Gratis
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Participa en sorteos y gana premios increíbles
                  </p>
                  <div className="flex items-center gap-2 text-sm font-medium text-accent">
                    Participar ahora
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </div>

            {/* Footer */}
            <div className="mt-6 text-center">
              <button
                onClick={closeExitIntent}
                className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                No gracias, continuar navegando
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
