'use client'

import { Gift, Sparkles, Trophy, Zap } from 'lucide-react'

interface GiveawaysHeroProps {
  stats: {
    totalGiveaways: number
    totalParticipants: number
    winnersCount: number
  }
}

export default function GiveawaysHero({ stats }: GiveawaysHeroProps) {
  return (
    <section className="relative pt-24 sm:pt-32 pb-12 sm:pb-16 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      
      {/* Animated Gradient Orbs */}
      <div className="absolute top-10 left-0 w-72 h-72 rounded-full bg-primary/10 blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-accent/10 blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-secondary/20 blur-3xl animate-pulse" style={{ animationDelay: '0.8s' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Animated Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-fade-in backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">100% Gratis</span>
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 animate-fade-in leading-tight" style={{ animationDelay: '0.1s' }}>
            <span className="text-foreground">Gana </span>
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              Cuentas Premium
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-xl mx-auto mb-8 animate-fade-in px-4" style={{ animationDelay: '0.2s' }}>
            Participa con tu nombre y Telegram.
            <span className="text-accent font-medium"> ¡Así de fácil!</span>
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            {[
              { value: stats.totalGiveaways, label: 'Sorteos', icon: Gift, color: 'primary' },
              { value: `${Math.floor(stats.totalParticipants / 1000)}K+`, label: 'Participantes', icon: Zap, color: 'accent' },
              { value: `${stats.winnersCount}+`, label: 'Ganadores', icon: Trophy, color: 'primary' },
            ].map((stat, index) => (
              <div 
                key={index} 
                className="flex items-center gap-2 sm:gap-3 px-4 py-2 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm hover:border-primary/50 transition-all"
              >
                <div className={`p-2 rounded-xl bg-${stat.color}/10`}>
                  <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 text-${stat.color}`} />
                </div>
                <div className="text-left">
                  <span className="text-xl sm:text-2xl font-bold text-foreground block leading-none">{stat.value}</span>
                  <span className="text-xs sm:text-sm text-muted-foreground">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
