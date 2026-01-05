'use client'

import * as React from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { User, Settings, LogOut, UserCircle, LayoutDashboard } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu'
import { SignOutButton } from '@/components/signout-button'

import { absoluteUrl } from '@/lib/utils'
import { useUserAPI } from '@/queries/client/users'

const AccountMenu = () => {
  const { t } = useTranslation()
  const { user } = useUserAPI()
  
  // Check if user is admin or superadmin
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="relative h-10 w-10 rounded-full ring-2 ring-primary/10 transition-all hover:ring-primary/30"
          size="icon"
          variant="ghost"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={user?.avatar_url ?? undefined}
              alt={`@${user?.username}`}
              className="object-cover"
            />
            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-sm font-semibold">
              {user?.username?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="sr-only">Toggle account menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="pb-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={user?.avatar_url ?? undefined}
                alt={`@${user?.username}`}
                className="object-cover"
              />
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-base font-semibold">
                {user?.username?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-semibold leading-none">{user?.full_name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                @{user?.username}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link
              href={user?.username ? absoluteUrl(`/${user?.username}`) : '#'}
              className="flex cursor-pointer items-center gap-2"
            >
              <UserCircle className="h-4 w-4" />
              <span>{t('profile')}</span>
            </Link>
          </DropdownMenuItem>
          {isAdmin && (
            <DropdownMenuItem asChild>
              <Link href="/dashboard" className="flex cursor-pointer items-center gap-2">
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem asChild>
            <Link href="/dashboard/users/profile" className="flex cursor-pointer items-center gap-2">
              <Settings className="h-4 w-4" />
              <span>{t('settings')}</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="p-0">
          <SignOutButton
            variant="ghost"
            className="flex h-auto w-full items-center justify-start gap-2 p-2 font-normal hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
            <span>{t('signout')}</span>
          </SignOutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { AccountMenu }
