'use client'

import { useState } from 'react'
import { Clock, Users, Gift, Crown, Zap, Flame } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface GiveawayCardProps {
  giveaway: any
  onJoin: () => void
}

export default function GiveawayCard({ giveaway, onJoin }: GiveawayCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const participantCount = giveaway.giveaway_participants?.[0]?.count || 0
  const maxParticipants = giveaway.max_participants || 5000
  const progress = (participantCount / maxParticipants) * 100
  const isHot = progress > 80
  
  // Calculate time remaining
  const endDate = new Date(giveaway.end_date)
  const now = new Date()
  const timeRemaining = endDate.getTime() - now.getTime()
  const daysRemaining = Math.floor(timeRemaining / (1000 * 60 * 60 * 24))
  const hoursRemaining = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const isEnding = daysRemaining === 0 && hoursRemaining < 24

  const timeString = daysRemaining > 0 
    ? `${daysRemaining}d ${hoursRemaining}h`
    : `${hoursRemaining}h ${Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60))}m`

  // Get platform info from title
  const getPlatformInfo = () => {
    const title = giveaway.title.toLowerCase()
    if (title.includes('netflix')) return { name: 'Netflix', color: '#E50914', emoji: '🎬' }
    if (title.includes('spotify')) return { name: 'Spotify', color: '#1DB954', emoji: '🎵' }
    if (title.includes('disney')) return { name: 'Disney+', color: '#0063e5', emoji: '🏰' }
    if (title.includes('hbo')) return { name: 'HBO Max', color: '#b535f6', emoji: '📺' }
    if (title.includes('prime')) return { name: 'Prime Video', color: '#00A8E1', emoji: '📦' }
    return { name: 'Premium', color: 'hsl(var(--primary))', emoji: '⭐' }
  }

  const platform = getPlatformInfo()

  return (
    <div
      className={`group relative overflow-hidden rounded-3xl transition-all duration-500 cursor-pointer ${
        giveaway.is_featured
          ? 'bg-card/50 backdrop-blur-sm border-2 border-primary/40 shadow-lg shadow-primary/20'
          : 'bg-card/40 backdrop-blur-sm border border-border/50 hover:border-primary/40'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onJoin}
      style={{
        transform: isHovered ? 'translateY(-6px) scale(1.01)' : 'translateY(0) scale(1)',
      }}
    >
      {/* Hot/Ending Badge */}
      {(isHot || isEnding) && (
        <div className="absolute top-4 left-4 z-20">
          <Badge
            className={`${
              isEnding ? 'bg-destructive/90' : 'bg-orange-500/90'
            } text-white font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 animate-pulse`}
          >
            <Flame className="w-3.5 h-3.5" />
            {isEnding ? '¡Termina pronto!' : '¡Popular!'}
          </Badge>
        </div>
      )}

      {/* Featured Crown */}
      {giveaway.is_featured && !isHot && !isEnding && (
        <div className="absolute top-4 left-4 z-20">
          <Badge className="bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
            <Crown className="w-3.5 h-3.5" />
            DESTACADO
          </Badge>
        </div>
      )}

      {/* Image Section */}
      <div className="relative h-44 sm:h-48 overflow-hidden bg-gradient-to-br from-primary/10 to-accent/5">
        {giveaway.thumbnail_url && (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700"
              style={{
                backgroundImage: `url(${giveaway.thumbnail_url})`,
                transform: isHovered ? 'scale(1.08)' : 'scale(1)',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
          </>
        )}

        {/* Platform Badge */}
        <div className="absolute top-4 right-4 z-10">
          <Badge
            className="font-bold px-3 py-1.5 rounded-xl backdrop-blur-md border-2"
            style={{
              backgroundColor: `${platform.color}25`,
              color: platform.color,
              borderColor: `${platform.color}40`,
            }}
          >
            <span className="mr-1">{platform.emoji}</span>
            {platform.name}
          </Badge>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 sm:p-6 space-y-4">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {giveaway.title}
          </h3>
          <p className="text-muted-foreground mt-1.5 flex items-center gap-2 text-sm sm:text-base">
            <Gift className="w-4 h-4 text-accent flex-shrink-0" />
            <span className="line-clamp-1">
              {giveaway.description || 'Cuenta Premium'}
            </span>
          </p>
        </div>

        {/* Progress Section */}
        <div className="space-y-2.5">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              <span className="font-medium text-foreground">
                {participantCount.toLocaleString()}
              </span>
              <span className="hidden sm:inline">
                / {maxParticipants.toLocaleString()}
              </span>
            </span>
            <span
              className="font-bold text-sm px-2.5 py-1 rounded-lg"
              style={{
                background:
                  progress > 80
                    ? 'rgba(255,100,100,0.15)'
                    : 'rgba(var(--primary), 0.15)',
                color: progress > 80 ? '#ff6b6b' : 'hsl(var(--primary))',
              }}
            >
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-2.5 bg-muted/40 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                progress > 80
                  ? 'bg-gradient-to-r from-orange-500 to-destructive'
                  : 'bg-gradient-to-r from-primary to-accent'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Timer & Action */}
        <div className="flex items-center justify-between pt-1 gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className={`p-2 rounded-xl ${
                isEnding ? 'bg-destructive/15' : 'bg-muted/30'
              }`}
            >
              <Clock
                className={`w-4 h-4 ${
                  isEnding
                    ? 'text-destructive animate-pulse'
                    : 'text-muted-foreground'
                }`}
              />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Termina en</p>
              <p
                className={`font-mono font-bold text-sm ${
                  isEnding ? 'text-destructive' : 'text-foreground'
                }`}
              >
                {timeString}
              </p>
            </div>
          </div>

          <Button
            onClick={(e) => {
              e.stopPropagation()
              onJoin()
            }}
            className="font-bold px-5 sm:px-6 py-2.5 rounded-xl transition-all hover:scale-105 active:scale-95 flex-shrink-0"
            style={{
              background: 'linear-gradient(to right, hsl(180 100% 50%), hsl(150 100% 50%))',
              color: 'hsl(222 47% 6%)',
              border: 'none',
              boxShadow: '0 0 25px rgba(0,245,255,0.4)',
            }}
          >
            <Zap className="w-4 h-4 mr-1.5" style={{ color: 'hsl(222 47% 6%)' }} />
            <span className="hidden sm:inline" style={{ color: 'hsl(222 47% 6%)' }}>Participar</span>
            <span className="sm:hidden" style={{ color: 'hsl(222 47% 6%)' }}>Unirse</span>
          </Button>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(circle at 50% 100%, ${
            giveaway.is_featured
              ? 'rgba(var(--primary), 0.08)'
              : 'rgba(var(--accent), 0.08)'
          } 0%, transparent 70%)`,
        }}
      />
    </div>
  )
}

