'use client'

import * as React from 'react'
import { ThemeProvider as NextThemeProvider } from 'next-themes'

interface ThemeProviderProps {
  children?: React.ReactNode
  value: { theme: string }
}

const ThemeProvider = ({ children, value }: ThemeProviderProps) => {
  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="dark"
      forcedTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </NextThemeProvider>
  )
}

export { ThemeProvider, type ThemeProviderProps }
