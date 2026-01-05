'use client'

import { useState } from 'react'
import { Gift } from 'lucide-react'
import GiveawayCard from '../giveaway-card'
import JoinGiveawayModal from './JoinGiveawayModal'

interface GiveawaysGridProps {
  giveaways: any[]
}

export default function GiveawaysGrid({ giveaways }: GiveawaysGridProps) {
  const [selectedGiveaway, setSelectedGiveaway] = useState<any | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleJoin = (giveaway: any) => {
    setSelectedGiveaway(giveaway)
    setIsModalOpen(true)
  }

  if (!giveaways || giveaways.length === 0) {
    return (
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-muted/30 flex items-center justify-center mb-6">
              <Gift className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              No hay sorteos disponibles
            </h3>
            <p className="text-muted-foreground">
              Vuelve pronto para ver nuevos sorteos
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {giveaways.map((giveaway, index) => (
              <div
                key={giveaway.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <GiveawayCard giveaway={giveaway} onJoin={() => handleJoin(giveaway)} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <JoinGiveawayModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        giveaway={selectedGiveaway}
      />
    </>
  )
}
