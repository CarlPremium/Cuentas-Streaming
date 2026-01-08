'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'
import { ThemeProvider as NextThemeProvider } from 'next-themes'

interface ThemeProviderProps {
  children?: React.ReactNode
  value: { theme: string }
}

const ThemeProvider = ({ children, value }: ThemeProviderProps) => {
  const pathname = usePathname()
  const isDashboard = pathname?.startsWith('/dashboard')

  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme={isDashboard ? 'light' : 'dark'}
      forcedTheme={isDashboard ? undefined : 'dark'}
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </NextThemeProvider>
  )
}

export { ThemeProvider, type ThemeProviderProps }
