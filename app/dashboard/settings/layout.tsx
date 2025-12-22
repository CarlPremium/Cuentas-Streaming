import * as React from 'react'
import { redirect } from 'next/navigation'

import { AppBar } from '@/app/dashboard/components/app-bar'
import { AppPanel } from '@/app/dashboard/components/app-panel'
import { DashboardTabs } from '@/app/dashboard/components/dashboard-tabs'

import { getUserAPI } from '@/queries/server/users'

export default async function SettingsLayout({
  children,
}: {
  children?: React.ReactNode
}) {
  const { user } = await getUserAPI()

  if (!user) redirect('/auth/signin')

  const tabs = [
    { href: '/dashboard/settings/account', label: 'account', icon: 'UserCog' as const },
    { href: '/dashboard/settings/notifications', label: 'notifications', icon: 'Bell' as const },
    { href: '/dashboard/settings/emails', label: 'emails', icon: 'Mail' as const },
    { href: '/dashboard/settings/security', label: 'password_and_authentication', icon: 'ShieldAlert' as const },
    { href: '/dashboard/settings/sessions', label: 'sessions', icon: 'RadioTower' as const, disabled: true },
  ]

  return (
    <div className="h-screen w-screen overflow-hidden">
      <AppBar className="sticky left-0 top-0 z-10" />
      <AppPanel>
        <div className="flex flex-1 flex-col">
          <DashboardTabs tabs={tabs} />
          {children}
        </div>
      </AppPanel>
    </div>
  )
}
