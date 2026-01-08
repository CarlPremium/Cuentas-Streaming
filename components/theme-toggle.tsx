'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'
import { LucideIcon } from '@/lib/lucide-icon'

interface ThemeToggleProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {}

const ThemeToggle = (props: ThemeToggleProps) => {
  const pathname = usePathname()
  const isDashboard = pathname?.startsWith('/dashboard')

  // Theme toggle only enabled in dashboard
  if (!isDashboard) {
    return null
  }

  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" {...props}>
        <LucideIcon name="Loader" className="h-5 w-5 animate-spin" />
        <span className="sr-only">Loading theme</span>
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      {...props}
    >
      {theme === 'dark' ? (
        <LucideIcon name="Sun" className="h-5 w-5" />
      ) : (
        <LucideIcon name="Moon" className="h-5 w-5" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

export { ThemeToggle, type ThemeToggleProps }
