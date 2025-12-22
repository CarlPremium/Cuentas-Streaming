'use client'

import * as React from 'react'

import { AccountMenu } from '@/components/account-menu'
import { SiteBrand } from '@/components/site-brand'
import { Notify } from '@/app/dashboard/components/notify'

import { cn } from '@/lib/utils'

interface AppBarProps extends React.HTMLAttributes<HTMLElement> {}

const AppBar = ({ children, className, ...props }: AppBarProps) => {
  return (
    <header
      className={cn(
        'flex w-full items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        'h-[60px] px-6 shadow-sm',
        className
      )}
      {...props}
    >
      <SiteBrand />
      {children}
      <div className="flex-1"></div>
      <Notify />
      <AccountMenu />
    </header>
  )
}

export { AppBar, type AppBarProps }
