import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Store, BookOpen, Gift, Home } from 'lucide-react'

import { absoluteUrl } from '@/lib/utils'
import { siteConfig } from '@/config/site'
import { SiteLogo } from '@/components/site-logo'

const navLinks = [
  {
    name: 'Inicio',
    href: '/',
    icon: Home,
  },
  {
    name: 'Tienda',
    href: '/store',
    icon: Store,
  },
  {
    name: 'Blog',
    href: '/posts',
    icon: BookOpen,
  },
  {
    name: 'Sorteos',
    href: '/giveaways',
    icon: Gift,
  },
]

const MobileNavigation = () => {
  const pathname = usePathname()

  return (
    <div className="grid w-full max-w-md gap-6">
      <div className="flex items-center gap-4">
        <SiteLogo className="size-8 min-w-8" />
        <span className="font-semibold">{siteConfig?.title}</span>
      </div>
      <nav className="grid gap-2">
        {navLinks.map((link) => {
          const isActive = pathname === link.href
          const Icon = link.icon
          
          return (
            <Link
              key={link.href}
              href={absoluteUrl(link.href)}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive 
                  ? 'bg-primary/10 text-primary font-semibold' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              {link.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

export { MobileNavigation }
