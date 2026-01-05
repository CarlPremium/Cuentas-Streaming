'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Store, BookOpen, Gift } from 'lucide-react'

import {
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenu,
} from '@/components/ui/navigation-menu'
import { absoluteUrl } from '@/lib/utils'

const navLinks = [
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

const Navigation = () => {
  const pathname = usePathname()

  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList className="gap-1">
        {navLinks.map((link) => {
          const isActive = pathname === link.href
          const Icon = link.icon
          
          return (
            <NavigationMenuLink key={link.href} asChild>
              <Link
                href={absoluteUrl(link.href)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive 
                    ? 'nav-link-active' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {link.name}
              </Link>
            </NavigationMenuLink>
          )
        })}
      </NavigationMenuList>
    </NavigationMenu>
  )
}

export { Navigation }
