'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { LucideIcon, type LucideIconName } from '@/lib/lucide-icon'
import { cn } from '@/lib/utils'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

export interface DashboardTab {
  href: string
  label: string
  icon?: LucideIconName
  disabled?: boolean
  badge?: string | number
}

interface DashboardTabsProps {
  tabs: DashboardTab[]
  translate?: boolean
}

export const DashboardTabs = ({ tabs, translate = true }: DashboardTabsProps) => {
  const { t } = useTranslation()
  const pathname = usePathname()

  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <ScrollArea className="w-full">
        <div className="flex gap-1 px-6 sm:px-8">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href || pathname.startsWith(`${tab.href}/`)
            const label = translate ? t(tab.label) : tab.label

            return (
              <Link
                key={tab.href}
                href={tab.disabled ? '#' : tab.href}
                className={cn(
                  'group relative flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-all',
                  isActive
                    ? 'border-primary text-foreground'
                    : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground',
                  tab.disabled && 'pointer-events-none opacity-50'
                )}
                aria-disabled={tab.disabled}
              >
                {tab.icon && (
                  <LucideIcon
                    name={tab.icon}
                    className={cn(
                      'size-4 transition-transform group-hover:scale-110',
                      isActive && 'text-primary'
                    )}
                  />
                )}
                <span>{label}</span>
                {tab.badge && (
                  <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                    {tab.badge}
                  </span>
                )}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
                )}
              </Link>
            )
          })}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </div>
  )
}
