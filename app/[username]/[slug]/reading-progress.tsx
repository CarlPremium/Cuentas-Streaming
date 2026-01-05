'use client'

import * as React from 'react'

export function ReadingProgress() {
  const [progress, setProgress] = React.useState(0)

  React.useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = (scrollTop / docHeight) * 100
      setProgress(Math.min(scrollPercent, 100))
    }

    window.addEventListener('scroll', updateProgress)
    updateProgress()

    return () => window.removeEventListener('scroll', updateProgress)
  }, [])

  return (
    <div className="reading-progress">
      <div 
        className="reading-progress-bar" 
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
