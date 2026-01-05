'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { LucideIcon } from '@/lib/lucide-icon'
import { Button } from '@/components/ui/button'
import {
  SheetTrigger,
  SheetContent,
  Sheet,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'

import { SiteBrand } from '@/components/site-brand'
import { Navigation } from '@/components/navigation'
import { MobileNavigation } from '@/components/mobile-navigation'
import { AccountMenu } from '@/components/account-menu'
import { SearchForm } from '@/components/search-form'
import { SearchFormDialog } from '@/components/search-form-dialog'

import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {}

const Header = ({ className, ...props }: HeaderProps) => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { user } = useAuth()

  return (
    <Sheet>
      <VisuallyHidden.Root>
        <SheetTitle>Sheet Content</SheetTitle>
        <SheetDescription>
          This is a hidden description for screen readers.
        </SheetDescription>
      </VisuallyHidden.Root>
      <SheetContent className="bg-white dark:bg-gray-900" side="left">
        <MobileNavigation />
      </SheetContent>
      <header
        className={
          (cn(
            'sticky left-0 top-0 z-50 flex w-full flex-col border-0 border-b border-solid border-input bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'
          ),
          className)
        }
        {...props}
      >
        <div className="container flex h-16 items-center">
          <SheetTrigger asChild>
            <Button
              type="button"
              className="md:hidden"
              size="icon"
              variant="ghost"
            >
              <LucideIcon name="Menu" className="size-6 min-w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SiteBrand className="mr-6 hidden md:flex" />
          <Navigation />
          <div className="ml-auto flex items-center gap-3">
            {user ? <SignedInNav /> : <SignedOutNav />}
          </div>
        </div>
      </header>
    </Sheet>
  )
}

const SignedInNav = () => {
  return <AccountMenu />
}

const SignedOutNav = () => {
  const router = useRouter()
  const { t } = useTranslation()

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        className="hidden sm:flex"
        onClick={() => router.push('/auth/signin')}
      >
        {t('signin')}
      </Button>
      <Button
        className="gap-2 shadow-sm"
        onClick={() => router.push('/auth/signup')}
      >
        <LucideIcon name="UserPlus" className="h-4 w-4" />
        <span>{t('signup')}</span>
      </Button>
      {/* Mobile signin button */}
      <Button
        variant="outline"
        size="icon"
        className="sm:hidden"
        onClick={() => router.push('/auth/signin')}
      >
        <LucideIcon name="LogIn" className="h-5 w-5" />
      </Button>
    </div>
  )
}

export { Header, type HeaderProps }
