import * as React from 'react'
import Link from 'next/link'

import { Copyright } from '@/components/copyright'
import { ThemeToggle } from '@/components/theme-toggle'
import { LanguageCombobox } from '@/components/language-combobox'
import { cn } from '@/lib/utils'

interface FooterProps extends React.HTMLAttributes<HTMLElement> {}

const Footer = ({ className, ...props }: FooterProps) => {
  return (
    <footer
      className={cn(
        'flex border-0 border-t border-solid border-input bg-inherit',
        className
      )}
      {...props}
    >
      <div className="container bg-inherit py-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <Copyright className="text-sm" />
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <Link href="/policy/terms" className="hover:text-foreground hover:underline">
                Términos y Condiciones
              </Link>
              <Link href="/policy/privacy" className="hover:text-foreground hover:underline">
                Política de Privacidad
              </Link>
              <Link href="/terms" className="hover:text-foreground hover:underline">
                Política de Cookies
              </Link>
            </div>
          </div>
          <div className="flex gap-2">
            <ThemeToggle />
            <LanguageCombobox />
          </div>
        </div>
      </div>
    </footer>
  )
}

export { Footer, type FooterProps }
