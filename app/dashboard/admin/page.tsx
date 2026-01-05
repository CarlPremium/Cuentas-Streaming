import * as React from 'react'
import Link from 'next/link'

import { PageHeader } from '@/app/dashboard/components/page-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LucideIcon } from '@/lib/lucide-icon'

export default function AdminPage() {
  return (
    <main className="flex-1 overflow-auto">
      <div className="mx-auto max-w-5xl space-y-6 p-6 pb-36">
        <PageHeader
          icon="ShieldCheck"
          title="admin"
          description="manage_system_settings_and_administration"
        />

        <div className="grid gap-6 md:grid-cols-2">
          {/* Giveaways Management */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-3">
                  <LucideIcon name="Gift" className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Giveaways</CardTitle>
                  <CardDescription>Manage all giveaways</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Create, edit, and manage giveaways. Select winners and view participant statistics.
              </p>
              <div className="flex gap-2">
                <Link href="/dashboard/admin/giveaways" className="flex-1">
                  <Button variant="default" className="w-full gap-2">
                    <LucideIcon name="LayoutList" className="h-4 w-4" />
                    View All
                  </Button>
                </Link>
                <Link href="/dashboard/admin/giveaways/create" className="flex-1">
                  <Button variant="outline" className="w-full gap-2">
                    <LucideIcon name="Plus" className="h-4 w-4" />
                    Create New
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* System Settings */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-muted p-3">
                  <LucideIcon name="Settings" className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <CardTitle translate="yes">system_settings</CardTitle>
                  <CardDescription translate="yes">
                    configure_system_wide_settings
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground" translate="yes">
                admin_panel_under_development
              </p>
              <Button variant="outline" disabled className="w-full">
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Overview of platform activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center gap-3 rounded-lg border p-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <LucideIcon name="Gift" className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Giveaways</p>
                  <p className="text-2xl font-bold">-</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border p-4">
                <div className="rounded-full bg-green-500/10 p-2">
                  <LucideIcon name="Users" className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Participants</p>
                  <p className="text-2xl font-bold">-</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border p-4">
                <div className="rounded-full bg-yellow-500/10 p-2">
                  <LucideIcon name="Trophy" className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Winners Selected</p>
                  <p className="text-2xl font-bold">-</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
