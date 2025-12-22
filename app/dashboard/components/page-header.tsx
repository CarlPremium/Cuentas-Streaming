import * as React from 'react'
import { cn } from '@/lib/utils'
import { LucideIcon, type LucideIconName } from '@/lib/lucide-icon'

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  icon?: LucideIconName
  actions?: React.ReactNode
}

export const PageHeader = ({
  title,
  description,
  icon,
  actions,
  className,
  ...props
}: PageHeaderProps) => {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between',
        className
      )}
      {...props}
    >
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <LucideIcon name={icon} className="size-5 text-primary" />
            </div>
          )}
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {title}
          </h1>
        </div>
        {description && (
          <p className="text-sm text-muted-foreground sm:text-base">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  )
}
