import * as React from 'react'
import { cn } from '@/lib/utils'

interface EntrySummaryProps extends React.HTMLAttributes<HTMLParagraphElement> {
  text: string | null
}

const EntrySummary = ({ className, text, ...props }: EntrySummaryProps) => {
  return (
    <p className={cn('line-clamp-2 w-full text-xs leading-relaxed', className)} {...props}>
      {text}
    </p>
  )
}

export { EntrySummary, type EntrySummaryProps }
