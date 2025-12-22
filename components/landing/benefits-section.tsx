import { Crown, Gift, ShieldCheck, Sparkles, Zap, Clock } from 'lucide-react'

const benefits = [
  {
    icon: Crown,
    title: 'Cuentas Premium',
    description: 'Netflix, Spotify, Disney+, YouTube Premium, HBO Max y muchas más plataformas completamente gratis',
    iconBg: 'bg-gradient-to-br from-neon-purple to-neon-pink',
  },
  {
    icon: Gift,
    title: 'Sorteos Diarios',
    description: 'Participa en sorteos exclusivos y gana cuentas premium, tarjetas de regalo y premios increíbles',
    iconBg: 'bg-gradient-to-br from-neon-cyan to-neon-green',
  },
  {
    icon: ShieldCheck,
    title: '100% Garantizado',
    description: 'Todas las cuentas están verificadas y garantizadas. Soporte 24/7 para cualquier inconveniente',
    iconBg: 'bg-gradient-to-br from-neon-blue to-neon-cyan',
  },
  {
    icon: Zap,
    title: 'Entrega Instantánea',
    description: 'Recibe tus cuentas al instante después de ganar. Sin esperas, sin complicaciones',
    iconBg: 'bg-gradient-to-br from-yellow-500 to-orange-500',
  },
  {
    icon: Sparkles,
    title: 'Contenido Exclusivo',
    description: 'Accede a ofertas especiales, códigos de descuento y promociones solo para miembros',
    iconBg: 'bg-gradient-to-br from-neon-pink to-neon-purple',
  },
  {
    icon: Clock,
    title: 'Actualizaciones 24/7',
    description: 'Nuevos sorteos y cuentas cada día. Nunca te quedarás sin oportunidades de ganar',
    iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-500',
  },
]

export function BenefitsSection() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-neon-purple/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-neon-cyan/10 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold bg-neon-green/10 text-neon-green border border-neon-green/20 mb-4">
            BENEFICIOS
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            ¿Qué obtienes al <span className="text-gradient">unirte</span>?
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
            Beneficios exclusivos que no encontrarás en ningún otro lugar
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.title}
              className="glass-card-hover p-6 sm:p-8 group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`feature-icon ${benefit.iconBg} text-background mb-5 sm:mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                <benefit.icon className="w-7 h-7" />
              </div>

              <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground mb-2 sm:mb-3">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4 sm:mb-6">
                {benefit.description}
              </p>

              <span className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-semibold bg-neon-green/20 text-neon-green border border-neon-green/30">
                Incluido GRATIS
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
