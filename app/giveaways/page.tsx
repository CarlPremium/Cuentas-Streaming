'use client'

import './giveaways.css'
import { useState, useEffect } from 'react'
import { Gift, Users, Trophy } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import GiveawayCard from './giveaway-card'
import JoinGiveawayModal from './components/JoinGiveawayModal'
import { createClient } from '@/supabase/client'

// Sample data for showcasing (will be replaced with real data from DB)
const sampleGiveaways = [
  {
    id: 1,
    title: 'Netflix Premium 1 Año',
    description: 'Cuenta Premium 4K',
    platform: 'Netflix',
    thumbnail_url: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&q=80',
    end_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    max_participants: 5000,
    is_featured: true,
    giveaway_participants: [{ count: 2847 }],
    users: { username: 'admin', full_name: 'Admin' }
  },
  {
    id: 2,
    title: 'Spotify Premium 6 Meses',
    description: 'Cuenta Individual',
    platform: 'Spotify',
    thumbnail_url: 'https://images.unsplash.com/photo-1611339555312-e607c8352fd7?w=800&q=80',
    end_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    max_participants: 3000,
    is_featured: false,
    giveaway_participants: [{ count: 1523 }],
    users: { username: 'admin', full_name: 'Admin' }
  },
  {
    id: 3,
    title: 'Disney+ Bundle Anual',
    description: 'Disney+ Hulu ESPN+',
    platform: 'Disney+',
    thumbnail_url: 'https://images.unsplash.com/photo-1640499900704-b00dd6a1103a?w=800&q=80',
    end_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    max_participants: 4000,
    is_featured: true,
    giveaway_participants: [{ count: 3201 }],
    users: { username: 'admin', full_name: 'Admin' }
  },
  {
    id: 4,
    title: 'HBO Max Premium',
    description: 'Premium Sin Anuncios',
    platform: 'HBO Max',
    thumbnail_url: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=800&q=80',
    end_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    max_participants: 2000,
    is_featured: false,
    giveaway_participants: [{ count: 982 }],
    users: { username: 'admin', full_name: 'Admin' }
  },
  {
    id: 5,
    title: 'Prime Video + Music',
    description: 'Amazon Prime Completo',
    platform: 'Prime Video',
    thumbnail_url: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=800&q=80',
    end_date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    max_participants: 3500,
    is_featured: false,
    giveaway_participants: [{ count: 1876 }],
    users: { username: 'admin', full_name: 'Admin' }
  },
  {
    id: 6,
    title: 'Netflix + Spotify Combo',
    description: 'Pack Premium Doble',
    platform: 'Netflix',
    thumbnail_url: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800&q=80',
    end_date: new Date(Date.now() + 0.5 * 24 * 60 * 60 * 1000).toISOString(),
    max_participants: 5000,
    is_featured: true,
    giveaway_participants: [{ count: 4521 }],
    users: { username: 'admin', full_name: 'Admin' }
  },
  {
    id: 7,
    title: 'Disney+ Premium',
    description: '6 Meses Premium 4K',
    platform: 'Disney+',
    thumbnail_url: 'https://images.unsplash.com/photo-1616530940355-351fabd9524b?w=800&q=80',
    end_date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    max_participants: 2500,
    is_featured: false,
    giveaway_participants: [{ count: 654 }],
    users: { username: 'admin', full_name: 'Admin' }
  },
  {
    id: 8,
    title: 'Spotify Familiar Anual',
    description: 'Plan Familiar 6 Cuentas',
    platform: 'Spotify',
    thumbnail_url: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=800&q=80',
    end_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    max_participants: 2500,
    is_featured: false,
    giveaway_participants: [{ count: 2109 }],
    users: { username: 'admin', full_name: 'Admin' }
  },
]

export default function GiveawaysPage() {
  const [giveaways, setGiveaways] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedGiveaway, setSelectedGiveaway] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [stats, setStats] = useState({
    totalGiveaways: 0,
    totalParticipants: 0,
    winnersCount: 0,
  })

  useEffect(() => {
    fetchGiveaways()
  }, [])

  const fetchGiveaways = async () => {
    try {
      setLoading(true)
      
      // Fetch from API
      const response = await fetch('/api/v1/giveaway?status=active&per_page=50')
      
      if (!response.ok) {
        throw new Error('Failed to fetch giveaways')
      }

      const data = await response.json()
      
      if (data.giveaways && data.giveaways.length > 0) {
        setGiveaways(data.giveaways)
        
        // Calculate stats from real data
        const totalGiveaways = data.giveaways.length
        const totalParticipants = data.giveaways.reduce((sum: number, g: any) => {
          return sum + (g.participant_count || 0)
        }, 0)

        // Fetch winners count
        const winnersResponse = await fetch('/api/v1/giveaway?status=ended&per_page=1000')
        const winnersData = await winnersResponse.json()
        const winnersCount = winnersData.giveaways?.filter((g: any) => g.winner_id || g.winner_guest_id).length || 0

        setStats({
          totalGiveaways,
          totalParticipants,
          winnersCount,
        })
      } else {
        // Use sample data if no giveaways in DB
        setGiveaways(sampleGiveaways)
        setStats({
          totalGiveaways: sampleGiveaways.length,
          totalParticipants: 15000,
          winnersCount: 500,
        })
      }
    } catch (error) {
      console.error('Error fetching giveaways:', error)
      // Use sample data on error
      setGiveaways(sampleGiveaways)
      setStats({
        totalGiveaways: sampleGiveaways.length,
        totalParticipants: 15000,
        winnersCount: 500,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleJoinClick = (giveaway: any) => {
    setSelectedGiveaway(giveaway)
    setIsModalOpen(true)
  }

  return (
    <div className="giveaways-page">
      <style jsx global>{`
        /* Override ALL button styles on giveaways page */
        .giveaways-page button[class*="gradient"],
        .giveaways-page button[class*="bg-gradient"],
        body:has(.giveaways-page) button[class*="gradient"],
        body:has(.giveaways-page) button[class*="bg-gradient"] {
          background: linear-gradient(to right, hsl(180 100% 50%), hsl(150 100% 50%)) !important;
          color: hsl(222 47% 6%) !important;
          border: none !important;
        }

        /* Participar buttons in cards */
        .giveaways-page .group button,
        .giveaways-page [class*="card"] button {
          background: linear-gradient(to right, hsl(180 100% 50%), hsl(150 100% 50%)) !important;
          color: hsl(222 47% 6%) !important;
          font-weight: 700 !important;
          border: none !important;
        }

        /* Modal buttons */
        body:has(.giveaways-page) div[class*="fixed"] button[type="submit"] {
          background: linear-gradient(to right, hsl(180 100% 50%), hsl(150 100% 50%)) !important;
          color: hsl(222 47% 6%) !important;
          font-weight: 700 !important;
          border: none !important;
        }

        /* Remove any white/black gradients */
        .giveaways-page button,
        body:has(.giveaways-page) button {
          background-image: none !important;
        }

        .giveaways-page button[class*="gradient"],
        body:has(.giveaways-page) button[class*="gradient"] {
          background-image: linear-gradient(to right, hsl(180 100% 50%), hsl(150 100% 50%)) !important;
        }

        /* Ensure button text is always dark on bright gradient */
        .giveaways-page button[class*="gradient"] *,
        body:has(.giveaways-page) button[class*="gradient"] * {
          color: hsl(222 47% 6%) !important;
        }

        /* Override shadcn button variants */
        .giveaways-page button.bg-primary,
        .giveaways-page button[class*="primary"] {
          background: linear-gradient(to right, hsl(180 100% 50%), hsl(150 100% 50%)) !important;
          color: hsl(222 47% 6%) !important;
        }
      `}</style>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <div className="giveaways-hero">
          <div className="giveaways-hero-bg">
            <div className="giveaways-orb giveaways-orb-1" />
            <div className="giveaways-orb giveaways-orb-2" />
          </div>

          <div className="container relative z-10 py-8 sm:py-12">
            <div className="text-center space-y-6">
              {/* Badge */}
              <div className="flex justify-center">
                <div className="giveaways-badge">
                  <span className="giveaways-badge-icon">✨</span>
                  <span>100% Gratis</span>
                </div>
              </div>

              {/* Title */}
              <div className="space-y-3">
                <h1 className="giveaways-title">
                  <span className="giveaways-title-gradient">Cuentas Premium</span>
                </h1>
                <p className="giveaways-subtitle">
                  Participa con tu nombre y Telegram.
                </p>
              </div>

              {/* Stats */}
              <div className="giveaways-stats">
                <div className="giveaways-stat-card">
                  <div className="giveaways-stat-icon giveaways-stat-icon-primary">
                    <Gift className="w-5 h-5" />
                  </div>
                  <div className="giveaways-stat-content">
                    <p className="giveaways-stat-value">{stats.totalGiveaways}</p>
                    <p className="giveaways-stat-label">Sorteos</p>
                  </div>
                </div>

                <div className="giveaways-stat-card">
                  <div className="giveaways-stat-icon giveaways-stat-icon-accent">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="giveaways-stat-content">
                    <p className="giveaways-stat-value">{Math.floor(stats.totalParticipants / 1000)}K+</p>
                    <p className="giveaways-stat-label">Participantes</p>
                  </div>
                </div>

                <div className="giveaways-stat-card">
                  <div className="giveaways-stat-icon giveaways-stat-icon-gold">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div className="giveaways-stat-content">
                    <p className="giveaways-stat-value">{stats.winnersCount}+</p>
                    <p className="giveaways-stat-label">Ganadores</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Giveaways Grid Section */}
        <div className="giveaways-grid-section">
          <div className="container py-12 sm:py-16">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="giveaways-skeleton" />
                ))}
              </div>
            ) : giveaways.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {giveaways.map((giveaway) => (
                  <GiveawayCard
                    key={giveaway.id}
                    giveaway={giveaway}
                    onJoin={() => handleJoinClick(giveaway)}
                  />
                ))}
              </div>
            ) : (
              <div className="giveaways-empty">
                <div className="giveaways-empty-icon">
                  <Gift className="w-12 h-12" />
                </div>
                <h3 className="giveaways-empty-title">No hay sorteos activos</h3>
                <p className="giveaways-empty-text">
                  Vuelve pronto para participar en nuevos sorteos
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />

      <JoinGiveawayModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          fetchGiveaways()
        }}
        giveaway={selectedGiveaway}
      />
    </div>
  )
}
