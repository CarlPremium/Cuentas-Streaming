import * as React from 'react'
import './landing.css'

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="landing-page dark min-h-screen">
      {children}
    </div>
  )
}
