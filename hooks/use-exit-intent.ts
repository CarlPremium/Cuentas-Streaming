'use client'

import { useState, useEffect, useCallback } from 'react'

const EXIT_INTENT_KEY = 'exit-intent-shown'
const EXIT_INTENT_COOLDOWN = 24 * 60 * 60 * 1000 // 24 hours

export function useExitIntent() {
  const [showExitIntent, setShowExitIntent] = useState(false)
  const [isEnabled, setIsEnabled] = useState(false)

  useEffect(() => {
    // Check if we should show exit intent
    const lastShown = localStorage.getItem(EXIT_INTENT_KEY)
    const now = Date.now()

    if (!lastShown || now - parseInt(lastShown) > EXIT_INTENT_COOLDOWN) {
      setIsEnabled(true)
    }
  }, [])

  const handleMouseLeave = useCallback((e: MouseEvent) => {
    // Only trigger if mouse leaves from top of page
    if (e.clientY <= 0 && isEnabled) {
      setShowExitIntent(true)
      localStorage.setItem(EXIT_INTENT_KEY, Date.now().toString())
      setIsEnabled(false) // Only show once per session
    }
  }, [isEnabled])

  useEffect(() => {
    if (isEnabled) {
      document.addEventListener('mouseleave', handleMouseLeave)
      return () => document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [isEnabled, handleMouseLeave])

  const closeExitIntent = () => {
    setShowExitIntent(false)
  }

  return {
    showExitIntent,
    closeExitIntent,
  }
}
