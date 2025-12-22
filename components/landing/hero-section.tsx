'use client'

import { useEffect, useRef, useState } from 'react'
import { Send, Gift, Users, ArrowRight, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ParticleField } from './particle-field'

const platforms = [
  { name: 'Netflix', color: 'bg-red-500', glow: 'shadow-red-500/50' },
  { name: 'Spotify', color: 'bg-green-500', glow: 'shadow-green-500/50' },
  { name: 'Disney+', color: 'bg-blue-500', glow: 'shadow-blue-500/50' },
  { name: 'YouTube', color: 'bg-red-600', glow: 'shadow-red-600/50' },
  { name: 'HBO Max', color: 'bg-purple-500', glow: 'shadow-purple-500/50' },
  { name: 'Amazon Prime', color: 'bg-cyan-500', glow: 'shadow-cyan-500/50' },
]

function FloatingCard({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div 
      className={`transform transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${className}`}
      style={{ 
        animation: isVisible ? `float3D 8s ease-in-out infinite ${delay}ms` : 'none',
      }}
    >
      {children}
    </div>
  )
}

export function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const heroRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect()
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height
        setMousePosition({ x, y })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cosmic">
      <ParticleField />
      
      <div className="absolute inset-0 bg-grid opacity-20" />
      
      <div 
        className="absolute w-[500px] h-[500px] md:w-[800px] md:h-[800px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          transform: `translate(calc(-50% + ${mousePosition.x * 30}px), calc(-50% + ${mousePosition.y * 30}px))`,
          transition: 'transform 0.3s ease-out',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/20 to-neon-cyan/20 rounded-full blur-3xl animate-morph" />
      </div>

      <div 
        className="absolute top-20 left-[10%] w-32 h-32 md:w-48 md:h-48"
        style={{
          transform: `translate(${mousePosition.x * -20}px, ${mousePosition.y * -20}px)`,
          transition: 'transform 0.5s ease-out',
        }}
      >
        <div className="w-full h-full bg-gradient-to-br from-neon-purple to-neon-pink rounded-full blur-2xl opacity-40 animate-float" />
      </div>
      
      <div 
        className="absolute bottom-32 right-[10%] w-40 h-40 md:w-64 md:h-64"
        style={{
          transform: `translate(${mousePosition.x * 25}px, ${mousePosition.y * 25}px)`,
          transition: 'transform 0.5s ease-out',
        }}
      >
        <div className="w-full h-full bg-gradient-to-br from-neon-cyan to-neon-green rounded-full blur-2xl opacity-30 animate-float-delayed" />
      </div>

      <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-neon-purple/30 to-transparent animate-pulse-slow" />
      <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-neon-cyan/30 to-transparent animate-pulse-slow" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center pt-20 sm:pt-24 pb-12 sm:pb-16">
        <FloatingCard delay={0} className="mb-6 sm:mb-8">
          <div className="relative inline-flex flex-col items-center">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-neon-green/20 text-neon-green border border-neon-green/30 mb-4 animate-bounce-gentle">
              NUEVO
            </span>
            <div className="relative">
              <div className="absolute inset-0 w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-purple animate-spin-slow opacity-50 blur-md" />
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-background via-secondary to-background border border-border/50 flex items-center justify-center shadow-2xl backdrop-blur-xl perspective-card">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-neon-cyan/20 via-neon-purple/30 to-neon-pink/20 flex items-center justify-center border border-border/30">
                  <span className="text-4xl sm:text-5xl font-heading font-bold text-gradient">CS</span>
                </div>
              </div>
            </div>
          </div>
        </FloatingCard>

        <FloatingCard delay={100}>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-3 sm:mb-4 relative">
            <span className="text-gradient-pink relative inline-block hover-glitch">
              Sorteos Premium
            </span>
          </h1>
        </FloatingCard>
        
        <FloatingCard delay={200}>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4 sm:mb-6 tracking-tight">
            Cuentas Streaming
          </h2>
        </FloatingCard>

        <FloatingCard delay={300}>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed px-4">
            El canal de <span className="text-neon-cyan font-semibold glow-text-cyan">Telegram #1</span> para{' '}
            <span className="text-neon-pink font-semibold glow-text-pink">sorteos de cuentas premium</span> de streaming, gaming
            y software ¡100% GRATIS!
          </p>
        </FloatingCard>

        <FloatingCard delay={400}>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
            <span className="badge-live group cursor-pointer hover:scale-105 transition-transform">
              <span className="w-2 h-2 rounded-full bg-background animate-ping absolute" />
              <span className="w-2 h-2 rounded-full bg-background relative" />
              En Vivo
            </span>
            <span className="badge-stats hover:border-neon-cyan/50 hover:shadow-lg hover:shadow-neon-cyan/20 transition-all cursor-pointer">
              <Users className="w-4 h-4 text-neon-cyan" />
              +64,000 miembros
            </span>
            <span className="badge-stats hover:border-neon-pink/50 hover:shadow-lg hover:shadow-neon-pink/20 transition-all cursor-pointer">
              <Gift className="w-4 h-4 text-neon-pink" />
              100% Gratis
            </span>
          </div>
        </FloatingCard>

        <FloatingCard delay={500}>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 mb-8 sm:mb-12 px-4">
            <Button className="btn-primary group relative overflow-hidden w-full sm:w-auto">
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <Send className="w-4 h-4 mr-2" />
              Únete GRATIS Ahora
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" className="btn-secondary group w-full sm:w-auto">
              <Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
              Ver Sorteos
            </Button>
          </div>
        </FloatingCard>

        <FloatingCard delay={600}>
          <div className="glass-card p-4 sm:p-6 max-w-md mx-auto mb-8 sm:mb-10 hover:shadow-2xl hover:shadow-neon-purple/20 transition-all duration-500 group perspective-card-hover cursor-pointer mx-4 sm:mx-auto">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-neon-purple/30 to-neon-cyan/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-neon-cyan" />
              </div>
              <div className="text-left">
                <h3 className="font-heading font-semibold text-foreground text-sm sm:text-base">Sorteos Diarios</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Netflix, Spotify, Disney+ y más</p>
              </div>
            </div>
          </div>
        </FloatingCard>

        <FloatingCard delay={700}>
          <div className="text-center px-4">
            <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">Plataformas disponibles en nuestros sorteos:</p>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {platforms.map((platform, index) => (
                <span 
                  key={platform.name} 
                  className={`platform-pill hover:shadow-lg ${platform.glow} group`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className={`w-2 h-2 rounded-full ${platform.color} group-hover:animate-ping`} />
                  <span className="text-xs sm:text-sm">{platform.name}</span>
                </span>
              ))}
            </div>
          </div>
        </FloatingCard>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden sm:block">
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2">
            <div className="w-1 h-2 bg-muted-foreground/50 rounded-full animate-scroll-indicator" />
          </div>
        </div>
      </div>
    </section>
  )
}
