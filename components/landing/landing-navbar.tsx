'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Store, BookOpen, Gift, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'

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

export function LandingNavbar() {
  const pathname = usePathname()
  const { user } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-green flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <span className="text-background font-bold text-lg">CS</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-heading font-bold text-lg text-foreground group-hover:text-neon-cyan transition-colors">
                Cuentas Streaming
              </h1>
              <p className="text-xs text-muted-foreground">Premium Accounts & Giveaways</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              const Icon = link.icon
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                    ${isActive 
                      ? 'bg-gradient-to-r from-neon-cyan/20 to-neon-green/20 text-neon-cyan border border-neon-cyan/30 shadow-lg shadow-neon-cyan/20' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {link.name}
                </Link>
              )
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <Link href="/dashboard">
                <Button 
                  size="sm" 
                  className="hidden sm:flex bg-gradient-to-r from-neon-cyan to-neon-green text-background font-semibold hover:scale-105 transition-transform shadow-lg"
                >
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/signin" className="hidden sm:block">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-neon-cyan to-neon-green text-background font-semibold hover:scale-105 transition-transform shadow-lg"
                  >
                    Registrarse
                  </Button>
                </Link>
              </>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              const Icon = link.icon
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300
                    ${isActive 
                      ? 'bg-gradient-to-r from-neon-cyan/20 to-neon-green/20 text-neon-cyan border border-neon-cyan/30' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  {link.name}
                </Link>
              )
            })}
            
            {!user && (
              <Link href="/auth/signin" onClick={() => setMobileMenuOpen(false)}>
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                >
                  Iniciar Sesión
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
