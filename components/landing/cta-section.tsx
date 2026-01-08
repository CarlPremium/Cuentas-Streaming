import { Send, Sparkles, Gift, Star, Headphones, Check, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const features = [
  { icon: Gift, label: 'Códigos', sublabel: 'Exclusivos' },
  { icon: Star, label: 'Ofertas', sublabel: 'Populares' },
  { icon: Sparkles, label: 'Descuentos', sublabel: 'VIP' },
  { icon: Headphones, label: 'Soporte', sublabel: 'Prioritario' },
]

const highlights = [
  '+64,000 miembros activos',
  'Sorteos 100% verificados',
  'Acceso instantáneo',
]

export function CTASection() {
  return (
    <section className="py-24 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-neon-purple/5 to-background" />
      
      <div className="absolute top-10 left-10 w-64 h-64 bg-neon-purple/20 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-neon-cyan/15 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="glass-card p-8 sm:p-12 text-center neon-border">
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            ¿Listo para <span className="text-gradient">unirte</span>?
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
            No te pierdas los sorteos más increíbles y únete a la comunidad más grande de Telegram
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <Button className="btn-primary group text-base px-8 py-6 font-semibold">
              <Send className="w-5 h-5 mr-2 text-white" strokeWidth={2} />
              <span>Unirse al Canal Telegram</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform text-white" strokeWidth={2} />
            </Button>
            <Button variant="outline" className="btn-secondary text-base px-8 py-6 font-semibold">
              <Sparkles className="w-5 h-5 mr-2" strokeWidth={2} />
              <span>Acceso Premium</span>
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {features.map((feature) => (
              <div key={feature.label} className="flex flex-col items-center p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-green flex items-center justify-center mb-3 shadow-lg">
                  <feature.icon className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
                <span className="font-heading font-semibold text-foreground text-sm">{feature.label}</span>
                <span className="text-xs text-muted-foreground">{feature.sublabel}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            {highlights.map((highlight) => (
              <div key={highlight} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="w-4 h-4 text-neon-green" />
                {highlight}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
