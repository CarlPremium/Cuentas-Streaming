'use client'

import { PartyPopper } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function GiveawaysCTA() {
  return (
    <section className="py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl p-6 sm:p-8 text-center overflow-hidden border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-accent/5 backdrop-blur-sm">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
          
          <div className="relative">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4">
              <PartyPopper className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
              ¿Quieres más sorteos?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Únete a nuestro canal de Telegram para enterarte primero de los nuevos sorteos
            </p>
            <Button
              asChild
              className="bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold hover:opacity-90 transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary/50"
            >
              <a
                href="https://t.me/cuentasstreaming"
                target="_blank"
                rel="noopener noreferrer"
              >
                Unirse a Telegram
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
