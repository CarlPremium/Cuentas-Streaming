'use client'

import { useState } from 'react'
import { Grid3X3, LayoutList, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

const platforms = [
  { id: 'all', label: 'Todos', emoji: '✨' },
  { id: 'netflix', label: 'Netflix', color: '#E50914', emoji: '🎬' },
  { id: 'spotify', label: 'Spotify', color: '#1DB954', emoji: '🎵' },
  { id: 'disney', label: 'Disney+', color: '#0063e5', emoji: '🏰' },
  { id: 'hbo', label: 'HBO', color: '#b535f6', emoji: '📺' },
  { id: 'prime', label: 'Prime', color: '#00A8E1', emoji: '📦' },
]

export default function GiveawaysFilter() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [activeView, setActiveView] = useState<'grid' | 'list'>('grid')

  return (
    <div className="sticky top-16 sm:top-20 z-30 py-3 sm:py-4 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Platform Filters - Horizontal Scroll on Mobile */}
          <div className="flex-1 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="flex gap-2 sm:gap-3 min-w-max">
              {platforms.map((platform) => {
                const isActive = activeFilter === platform.id
                return (
                  <Button
                    key={platform.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveFilter(platform.id)}
                    className={`rounded-full px-3 sm:px-4 py-2 h-auto transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-primary/20 text-primary border-2 border-primary/40 shadow-lg shadow-primary/20'
                        : 'bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted/50 border-2 border-transparent'
                    }`}
                    style={
                      isActive && platform.id !== 'all'
                        ? { borderColor: `${platform.color}60`, boxShadow: `0 0 15px ${platform.color}30` }
                        : {}
                    }
                  >
                    <span className="mr-1.5 text-base">{platform.emoji}</span>
                    <span className="text-sm font-medium">{platform.label}</span>
                    {platform.id === 'all' && (
                      <Sparkles className="w-3 h-3 ml-1 text-primary" />
                    )}
                  </Button>
                )
              })}
            </div>
          </div>

          {/* View Toggle - Desktop Only */}
          <div className="hidden sm:flex items-center gap-1 p-1 bg-muted/30 rounded-xl">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setActiveView('grid')}
              className={`h-9 w-9 rounded-lg transition-all ${
                activeView === 'grid'
                  ? 'bg-primary/20 text-primary shadow-lg shadow-primary/20'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setActiveView('list')}
              className={`h-9 w-9 rounded-lg transition-all ${
                activeView === 'list'
                  ? 'bg-primary/20 text-primary shadow-lg shadow-primary/20'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <LayoutList className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
