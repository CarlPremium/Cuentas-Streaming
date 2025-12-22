'use client'

import { Star, Quote } from 'lucide-react'
import { useState, useEffect } from 'react'

const testimonials = [
  {
    id: 1,
    name: 'María García',
    username: '@mariag_2024',
    avatar: 'MG',
    content: 'Increíble comunidad! Gané mi cuenta de Netflix en el primer sorteo. 100% recomendado para todos.',
    rating: 5,
    platform: 'Netflix',
    gradient: 'from-red-500 to-red-600',
  },
  {
    id: 2,
    name: 'Carlos Rodríguez',
    username: '@carlos_rod',
    avatar: 'CR',
    content: 'Llevaba meses buscando algo así. Los sorteos son reales y el soporte es excelente. Ya gané Spotify Premium!',
    rating: 5,
    platform: 'Spotify',
    gradient: 'from-green-500 to-green-600',
  },
  {
    id: 3,
    name: 'Ana Martínez',
    username: '@anamtz_',
    avatar: 'AM',
    content: 'No podía creerlo cuando gané Disney+. El proceso fue super fácil y la cuenta funciona perfectamente.',
    rating: 5,
    platform: 'Disney+',
    gradient: 'from-blue-500 to-blue-600',
  },
  {
    id: 4,
    name: 'Pedro Sánchez',
    username: '@pedro_sanchez',
    avatar: 'PS',
    content: 'La mejor comunidad de Telegram! Ya gané HBO Max y YouTube Premium. Los sorteos son diarios y muy justos.',
    rating: 5,
    platform: 'HBO Max',
    gradient: 'from-purple-500 to-purple-600',
  },
  {
    id: 5,
    name: 'Laura Fernández',
    username: '@lauraf',
    avatar: 'LF',
    content: 'Excelente atención y sorteos verificados. Gané Amazon Prime y la cuenta llegó en minutos. Súper recomendado!',
    rating: 5,
    platform: 'Amazon Prime',
    gradient: 'from-cyan-500 to-cyan-600',
  },
]

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      <div className="absolute top-20 left-10 w-64 h-64 bg-neon-purple/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-neon-cyan/10 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold bg-neon-pink/10 text-neon-pink border border-neon-pink/20 mb-4">
            TESTIMONIOS
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Lo que dicen nuestros <span className="text-gradient-pink">ganadores</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
            Miles de usuarios ya han ganado sus cuentas premium favoritas
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`glass-card-hover p-5 sm:p-6 relative ${index === activeIndex % 3 ? 'ring-1 ring-primary/30' : ''}`}
            >
              <Quote className="absolute top-4 right-4 w-6 h-6 text-muted-foreground/20" />

              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-white font-bold text-sm`}>
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-foreground text-sm sm:text-base">{testimonial.name}</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">{testimonial.username}</p>
                </div>
              </div>

              <div className="flex gap-1 mb-3">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                ))}
              </div>

              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                "{testimonial.content}"
              </p>

              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${testimonial.gradient} text-white`}>
                Ganó {testimonial.platform}
              </span>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6 max-w-4xl mx-auto">
          {testimonials.slice(3, 5).map((testimonial) => (
            <div
              key={testimonial.id}
              className="glass-card-hover p-5 sm:p-6 relative"
            >
              <Quote className="absolute top-4 right-4 w-6 h-6 text-muted-foreground/20" />

              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-white font-bold text-sm`}>
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-foreground text-sm sm:text-base">{testimonial.name}</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">{testimonial.username}</p>
                </div>
              </div>

              <div className="flex gap-1 mb-3">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                ))}
              </div>

              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                "{testimonial.content}"
              </p>

              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${testimonial.gradient} text-white`}>
                Ganó {testimonial.platform}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
