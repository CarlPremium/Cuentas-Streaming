'use client'

import * as React from 'react'
import Link, { type LinkProps } from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'

import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui-custom/accordion'

import { cn } from '@/lib/utils'
import { LucideIcon, type LucideIconName } from '@/lib/lucide-icon'
import { useAppSelector } from '@/lib/redux/hooks'
import {
  dashboardConfig,
  type DashboardNavItem,
  type DashboardNavSubItem,
} from '@/config/dashboard'
import { useUserAPI } from '@/queries/client/users'

const Navigation = () => {
  const { user } = useUserAPI()
  const pathname = usePathname()
  const defaultValue = pathname.split('/').slice(0, 3).join('/')

  return (
    <nav className="space-y-1 p-3">
      <Accordion type="multiple" defaultValue={[defaultValue]} className="space-y-1">
        {dashboardConfig?.nav?.map((item: DashboardNavItem) => {
          const denied =
            Array.isArray(item?.roles) &&
            user?.role &&
            !item?.roles?.includes(user?.role)
          return denied ? null : (
            <React.Fragment key={item?.id}>
              {item?.separator ? <Separator className="my-3" /> : null}
              <NavItem item={item} />
            </React.Fragment>
          )
        })}
      </Accordion>
    </nav>
  )
}

const NavItem = ({ item }: { item: DashboardNavItem }) => {
  const { t } = useTranslation()
  const { collapsed } = useAppSelector(({ app }) => app)

  return (
    <AccordionItem value={item?.href} className="border-none">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <AccordionTrigger
              className={cn(
                'px-0 py-0 hover:no-underline',
                Array.isArray(item?.sub) ? '' : 'hover:cursor-default [&[data-state=open]>svg]:rotate-0'
              )}
            >
              <div className="flex w-full items-center">
                <NavLink
                  collapsed={collapsed}
                  href={item?.href}
                  translate={item?.translate}
                  iconName={item?.iconName}
                  iconClassName=""
                  disabled={item?.disabled}
                  className="flex-1"
                >
                  {item?.text}
                </NavLink>
                {!collapsed && Array.isArray(item?.sub) ? (
                  <LucideIcon
                    name="ChevronDown"
                    className="ml-2 size-4 min-w-4 shrink-0 text-muted-foreground transition-transform duration-200"
                  />
                ) : null}
              </div>
            </AccordionTrigger>
          </TooltipTrigger>
          {collapsed && item?.text ? (
            <TooltipContent side="right" align="center">
              {item?.translate === 'yes' ? t(item?.text) : item?.text}
            </TooltipContent>
          ) : null}
        </Tooltip>
      </TooltipProvider>
      {!collapsed ? <NavSub item={item} /> : null}
    </AccordionItem>
  )
}

const NavSub = ({ item }: { item: DashboardNavItem }) => {
  const { user } = useUserAPI()
  const { collapsed } = useAppSelector(({ app }) => app)

  return (
    <AccordionContent
      className={cn(
        'pb-1 pt-1',
        Array.isArray(item?.sub) && item?.sub?.length > 0
          ? 'ml-4 space-y-1 border-l-2 border-border pl-4'
          : ''
      )}
    >
      {item?.sub?.map((sub: DashboardNavSubItem) => {
        const denied =
          Array.isArray(sub?.roles) &&
          user?.role &&
          !sub?.roles?.includes(user?.role)
        return denied ? null : (
          <React.Fragment key={sub?.id}>
            {sub?.separator ? <Separator className="my-2" /> : null}
            <NavLink
              collapsed={collapsed}
              href={sub?.href}
              translate={sub?.translate}
              iconName={sub?.iconName}
              iconClassName=""
              disabled={sub?.disabled}
              className="text-xs"
            >
              {sub?.text}
            </NavLink>
          </React.Fragment>
        )
      })}
    </AccordionContent>
  )
}

interface NavLinkProps
  extends LinkProps,
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  collapsed: boolean
  iconName?: LucideIconName
  iconClassName?: string
  text?: string
  ns?: string
  disabled?: boolean
}

const NavLink = ({
  children,
  className,
  href,
  collapsed,
  iconName,
  iconClassName,
  text,
  ns,
  translate,
  disabled = false,
  ...props
}: NavLinkProps) => {
  const { t } = useTranslation()
  const pathname = usePathname()
  const parent = pathname.split('/').slice(0, 3).join('/')
  const isActive = [pathname, parent].includes(href as string)

  return (
    <div className={cn(disabled ? 'cursor-not-allowed' : '')}>
      <Link
        href={href}
        className={cn(
          'group flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all',
          disabled 
            ? 'pointer-events-none opacity-50' 
            : 'hover:bg-accent hover:text-accent-foreground',
          isActive
            ? 'bg-accent text-accent-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground',
          className
        )}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : undefined}
        {...props}
      >
        {iconName ? (
          <LucideIcon
            name={iconName}
            className={cn(
              'size-4 min-w-4 transition-transform group-hover:scale-110',
              iconClassName
            )}
          />
        ) : null}
        <span className={cn(collapsed ? 'hidden' : '', 'truncate')}>
          {text && translate === 'yes' ? t(text, { ns }) : text}
          {children && typeof children === 'string' && translate === 'yes'
            ? t(children, { ns })
            : children}
        </span>
      </Link>
    </div>
  )
}

export { Navigation }
