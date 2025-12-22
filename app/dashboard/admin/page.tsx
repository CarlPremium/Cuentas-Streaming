import * as React from 'react'

import { PageHeader } from '@/app/dashboard/components/page-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
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

        <Alert>
          <LucideIcon name="Info" className="h-4 w-4" />
          <AlertDescription translate="yes">
            admin_features_coming_soon
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle translate="yes">system_settings</CardTitle>
            <CardDescription translate="yes">
              configure_system_wide_settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground" translate="yes">
              admin_panel_under_development
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
