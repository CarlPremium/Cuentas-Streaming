import * as React from 'react'
import { redirect } from 'next/navigation'

import { Separator } from '@/components/ui/separator'
import { Title } from '@/components/title'
import { Description } from '@/components/description'
import { LucideIcon } from '@/lib/lucide-icon'

import { LatestPosts, PostRanks } from '@/app/dashboard/dashboard'
import { AppBar } from '@/app/dashboard/components/app-bar'
import { AppPanel } from '@/app/dashboard/components/app-panel'

import { getUserAPI } from '@/queries/server/users'

export default async function DashboardPage() {
  const { user } = await getUserAPI()

  if (!user) redirect('/auth/signin')

  return (
    <div className="h-screen w-screen overflow-hidden">
      <AppBar className="sticky left-0 top-0 z-10" />
      <AppPanel>
        <div className="flex flex-1 flex-col bg-muted/30">
          <main className="flex-1 overflow-auto">
            {/* Header Section */}
            <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="px-6 py-6 sm:px-8">
                <div className="space-y-2">
                  <Title translate="yes" className="text-3xl font-bold tracking-tight">
                    dashboard
                  </Title>
                  <Description translate="yes" className="text-muted-foreground">
                    Welcome back! Here's what's happening with your content.
                  </Description>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="h-[calc(100vh-180px)] p-6 pb-8 sm:p-8">
              {/* Main Content Grid - Full Height */}
              <div className="grid h-full gap-6 lg:grid-cols-2">
                <LatestPosts user={user} />
                <PostRanks user={user} />
              </div>
            </div>
          </main>
        </div>
      </AppPanel>
    </div>
  )
}
