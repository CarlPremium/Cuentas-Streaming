'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import { Sparkles, Gift, Menu, X } from 'lucide-react'

import { LucideIcon } from '@/lib/lucide-icon'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'

interface LandingHeaderProps extends React.HTMLAttributes<HTMLElement> {}

export function LandingHeader({ className, ...props }: LandingHeaderProps) {
  const router = useRouter()
  const { user } = useAuth()
  const { t } = useTranslation()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed left-0 top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'bg-background/80 backdrop-blur-xl border-b border-border/40 shadow-lg shadow-primary/5'
          : 'bg-transparent',
        className
      )}
      {...props}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => router.push('/')}
            className="group flex items-center gap-2 transition-transform hover:scale-105"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-neon-purple to-neon-cyan opacity-75 blur-md group-hover:opacity-100 transition-opacity" />
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-neon-purple to-neon-cyan">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
            </div>
            <span className="font-heading text-xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              Cuentas Streaming
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink href="/posts" icon="FileText">
              Publicaciones
            </NavLink>
            <NavLink href="/giveaways" icon="Gift">
              Sorteos
            </NavLink>
            <NavLink href="/store" icon="ShoppingBag">
              Tienda
            </NavLink>
            <NavLink href="/search" icon="Search">
              Buscar
            </NavLink>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <Button
                onClick={() => router.push('/dashboard')}
                className="relative overflow-hidden bg-gradient-to-r from-neon-purple to-neon-cyan hover:from-neon-purple/90 hover:to-neon-cyan/90 text-white border-0 shadow-lg shadow-neon-purple/50 hover:shadow-neon-cyan/50 transition-all duration-300"
              >
                <LucideIcon name="LayoutDashboard" className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => router.push('/auth/signin')}
                  className="text-white/90 hover:text-white hover:bg-white/10 transition-colors"
                >
                  {t('signin')}
                </Button>
                <Button
                  onClick={() => router.push('/auth/signup')}
                  className="relative overflow-hidden bg-gradient-to-r from-neon-purple to-neon-cyan hover:from-neon-purple/90 hover:to-neon-cyan/90 text-white border-0 shadow-lg shadow-neon-purple/50 hover:shadow-neon-cyan/50 transition-all duration-300 group"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <LucideIcon name="UserPlus" className="h-4 w-4" />
                    {t('signup')}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan to-neon-purple opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <Menu className="h-6 w-6 text-white" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10 animate-in slide-in-from-top duration-200">
            <nav className="flex flex-col gap-2">
              <MobileNavLink href="/posts" icon="FileText" onClick={() => setMobileMenuOpen(false)}>
                Publicaciones
              </MobileNavLink>
              <MobileNavLink href="/giveaways" icon="Gift" onClick={() => setMobileMenuOpen(false)}>
                Sorteos
              </MobileNavLink>
              <MobileNavLink href="/store" icon="ShoppingBag" onClick={() => setMobileMenuOpen(false)}>
                Tienda
              </MobileNavLink>
              <MobileNavLink href="/search" icon="Search" onClick={() => setMobileMenuOpen(false)}>
                Buscar
              </MobileNavLink>
            </nav>

            {/* Mobile Auth */}
            <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-white/10">
              {user ? (
                <Button
                  onClick={() => {
                    router.push('/dashboard')
                    setMobileMenuOpen(false)
                  }}
                  className="w-full bg-gradient-to-r from-neon-purple to-neon-cyan hover:from-neon-purple/90 hover:to-neon-cyan/90 text-white"
                >
                  <LucideIcon name="LayoutDashboard" className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      router.push('/auth/signin')
                      setMobileMenuOpen(false)
                    }}
                    className="w-full text-white hover:bg-white/10"
                  >
                    {t('signin')}
                  </Button>
                  <Button
                    onClick={() => {
                      router.push('/auth/signup')
                      setMobileMenuOpen(false)
                    }}
                    className="w-full bg-gradient-to-r from-neon-purple to-neon-cyan hover:from-neon-purple/90 hover:to-neon-cyan/90 text-white"
                  >
                    <LucideIcon name="UserPlus" className="h-4 w-4 mr-2" />
                    {t('signup')}
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

function NavLink({
  href,
  icon,
  children,
}: {
  href: string
  icon: string
  children: React.ReactNode
}) {
  const router = useRouter()

  return (
    <button
      onClick={() => router.push(href)}
      className="group relative px-4 py-2 rounded-lg text-white/80 hover:text-white transition-all duration-200 hover:bg-white/10"
    >
      <div className="flex items-center gap-2">
        <LucideIcon name={icon as any} className="h-4 w-4 group-hover:scale-110 transition-transform" />
        <span className="text-sm font-medium">{children}</span>
      </div>
    </button>
  )
}

function MobileNavLink({
  href,
  icon,
  children,
  onClick,
}: {
  href: string
  icon: string
  children: React.ReactNode
  onClick?: () => void
}) {
  const router = useRouter()

  return (
    <button
      onClick={() => {
        router.push(href)
        onClick?.()
      }}
      className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
    >
      <LucideIcon name={icon as any} className="h-5 w-5" />
      <span className="text-sm font-medium">{children}</span>
    </button>
  )
}
