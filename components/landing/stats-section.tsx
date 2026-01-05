import { Users, Gift, ShieldCheck, Zap } from 'lucide-react'

const stats = [
  {
    icon: Users,
    value: '+64,000',
    label: 'Miembros Activos',
    gradient: 'from-neon-purple to-neon-pink',
  },
  {
    icon: Gift,
    value: 'Diarios',
    label: 'Sorteos Activos',
    gradient: 'from-neon-cyan to-neon-green',
  },
  {
    icon: ShieldCheck,
    value: '100%',
    label: 'Garantizado',
    gradient: 'from-neon-blue to-neon-cyan',
  },
  {
    icon: Zap,
    value: '24/7',
    label: 'Soporte',
    gradient: 'from-neon-green to-neon-cyan',
  },
]

export function StatsSection() {
  return (
    <section className="py-24 px-4 sm:px-6 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 via-background to-background" />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Estadísticas en <span className="text-gradient">Tiempo Real</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Números que hablan por sí solos
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="stat-card group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-7 h-7 text-background" />
              </div>

              {/* Value */}
              <div className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-1">
                {stat.value}
              </div>

              {/* Label */}
              <p className="text-sm text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
