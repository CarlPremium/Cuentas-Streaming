import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const faqs = [
  {
    question: '¿Es realmente gratis participar?',
    answer: '¡Sí! Participar en todos nuestros sorteos es 100% gratis. Solo necesitas unirte a nuestro canal de Telegram y seguir las instrucciones de cada sorteo. No hay costos ocultos ni suscripciones de pago obligatorias.',
  },
  {
    question: '¿Cómo sé que los sorteos son reales?',
    answer: 'Todos nuestros sorteos son transparentes y verificables. Publicamos los ganadores en el canal con capturas de pantalla de la entrega de premios. Además, contamos con más de 64,000 miembros que pueden confirmar la legitimidad de nuestros sorteos.',
  },
  {
    question: '¿Cuánto tiempo duran las cuentas premium?',
    answer: 'La duración de las cuentas varía según el sorteo. Generalmente ofrecemos cuentas con duración de 1 mes, 3 meses, 6 meses o incluso 1 año completo. La duración específica se indica en cada publicación del sorteo.',
  },
  {
    question: '¿Qué plataformas están disponibles?',
    answer: 'Realizamos sorteos de las principales plataformas de streaming: Netflix, Spotify Premium, Disney+, YouTube Premium, HBO Max, Amazon Prime Video, Crunchyroll, y muchas más. También incluimos cuentas de gaming y software.',
  },
  {
    question: '¿Cómo recibo mi cuenta si gano?',
    answer: 'Una vez que ganas un sorteo, te contactamos directamente por Telegram para entregarte los datos de acceso de forma segura. El proceso es rápido y normalmente recibes tu cuenta en menos de 24 horas después de ser seleccionado como ganador.',
  },
  {
    question: '¿Puedo participar desde cualquier país?',
    answer: '¡Sí! Nuestros sorteos están abiertos a participantes de todo el mundo hispanohablante. No importa desde qué país te unas, tienes las mismas oportunidades de ganar que todos los demás miembros.',
  },
]

export function FAQSection() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-neon-purple/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-neon-cyan/5 rounded-full blur-3xl" />

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold bg-neon-purple/10 text-neon-purple border border-neon-purple/20 mb-4">
            FAQ
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Preguntas <span className="text-gradient">Frecuentes</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
            Resolvemos todas tus dudas sobre nuestra comunidad
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-3 sm:space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="glass-card border-none px-4 sm:px-6 py-1 data-[state=open]:ring-1 data-[state=open]:ring-primary/30 transition-all"
            >
              <AccordionTrigger className="text-left font-heading font-semibold text-foreground hover:no-underline py-4 sm:py-5 text-sm sm:text-base">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4 sm:pb-5">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
