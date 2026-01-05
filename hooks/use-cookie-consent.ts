'use client'

import { useState, useEffect } from 'react'

const COOKIE_CONSENT_KEY = 'cookie-consent'

export type CookieConsent = 'accepted' | 'rejected' | null

export function useCookieConsent() {
  const [consent, setConsent] = useState<CookieConsent>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Only run on client
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY)
    setConsent(stored as CookieConsent)
    setIsLoaded(true)
  }, [])

  const acceptCookies = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted')
    setConsent('accepted')
  }

  const rejectCookies = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'rejected')
    setConsent('rejected')
  }

  const resetConsent = () => {
    localStorage.removeItem(COOKIE_CONSENT_KEY)
    setConsent(null)
  }

  return {
    consent,
    isLoaded,
    acceptCookies,
    rejectCookies,
    resetConsent,
    showBanner: isLoaded && consent === null,
  }
}
