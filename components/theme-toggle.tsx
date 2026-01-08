'use client'

import * as React from 'react'

interface ThemeToggleProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {}

// Theme toggle disabled - dark mode only
const ThemeToggle = (props: ThemeToggleProps) => {
  return null
}

export { ThemeToggle, type ThemeToggleProps }
