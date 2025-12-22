import * as React from 'react'
import { icons, LucideProps } from 'lucide-react'

export type LucideIconName = keyof typeof icons

export type LucideIconProps = LucideProps & {
  name: LucideIconName
}

export function LucideIcon({ name, ...props }: LucideIconProps) {
  const Icon = icons[name]

  if (!Icon) {
    console.error(`LucideIcon: Icon "${name}" not found in lucide-react`)
    // Return a fallback icon (Circle) or null
    const FallbackIcon = icons['Circle']
    return FallbackIcon ? <FallbackIcon {...props} /> : null
  }

  return <Icon {...props} />
}
