'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LucideIcon } from '@/lib/lucide-icon'

interface Category {
  id: number
  name: string
  slug: string
  icon: string
}

interface StoreFiltersProps {
  categories: Category[]
  currentCategory: string
  currentSearch: string
}

export function StoreFilters({ categories, currentCategory, currentSearch }: StoreFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = React.useState(currentSearch)

  const handleCategoryChange = (categorySlug: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (categorySlug === 'all') {
      params.delete('category')
    } else {
      params.set('category', categorySlug)
    }
    router.push(`/store?${params.toString()}`)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (search) {
      params.set('search', search)
    } else {
      params.delete('search')
    }
    router.push(`/store?${params.toString()}`)
  }

  const allCategories = [
    { id: 0, name: 'Todos', slug: 'all', icon: 'Sparkles' },
    ...categories.map(cat => ({ ...cat, slug: cat.slug || cat.name.toLowerCase() }))
  ]

  return (
    <section className="store-filters">
      <div className="container py-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Category Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            {allCategories.map((category) => {
              const isActive = currentCategory === category.slug || (currentCategory === 'all' && category.slug === 'all')
              return (
                <Button
                  key={category.id}
                  variant={isActive ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleCategoryChange(category.slug)}
                  className={`flex-shrink-0 ${
                    isActive
                      ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground'
                      : 'border-border/50'
                  }`}
                >
                  <LucideIcon name={category.icon as any} className="mr-1.5 h-4 w-4" />
                  {category.name}
                </Button>
              )
            })}
          </div>

          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar productos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-secondary/50 border-border/50"
            />
          </form>
        </div>
      </div>
    </section>
  )
}
