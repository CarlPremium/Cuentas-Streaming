import { Send, UserPlus, Gift, PartyPopper } from 'lucide-react'

const steps = [
  {
    step: 1,
    icon: Send,
    title: 'Únete al Canal',
    description: 'Haz clic en el botón y únete a nuestro canal de Telegram completamente gratis',
    gradient: 'from-neon-cyan to-neon-green',
  },
  {
    step: 2,
    icon: UserPlus,
    title: 'Activa Notificaciones',
    description: 'Activa las notificaciones para no perderte ningún sorteo exclusivo',
    gradient: 'from-neon-purple to-neon-pink',
  },
  {
    step: 3,
    icon: Gift,
    title: 'Participa en Sorteos',
    description: 'Participa en los sorteos diarios siguiendo las instrucciones de cada publicación',
    gradient: 'from-neon-blue to-neon-cyan',
  },
  {
    step: 4,
    icon: PartyPopper,
    title: '¡Gana Premios!',
    description: 'Recibe tus cuentas premium verificadas directamente en tu bandeja de entrada',
    gradient: 'from-neon-pink to-neon-purple',
  },
]

export function HowItWorksSection() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-background relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20 mb-4">
            FÁCIL Y RÁPIDO
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            ¿Cómo <span className="text-gradient">funciona</span>?
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
            En solo 4 simples pasos puedes empezar a ganar cuentas premium gratis
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
          {steps.map((item, index) => (
            <div key={item.step} className="relative group">
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-px bg-gradient-to-r from-border to-transparent" />
              )}
              
              <div className="glass-card-hover p-6 sm:p-8 text-center h-full">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center">
                  <span className="text-xs font-bold text-muted-foreground">{item.step}</span>
                </div>

                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mx-auto mb-5 sm:mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                  <item.icon className="w-8 h-8 sm:w-10 sm:h-10 text-background" />
                </div>

                <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground mb-2 sm:mb-3">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
