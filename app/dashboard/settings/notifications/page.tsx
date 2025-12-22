import * as React from 'react'

import { PageHeader } from '@/app/dashboard/components/page-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import { NotificationsForm } from './notifications-form'

export default function NotificationsPage() {
  return (
    <main className="flex-1 overflow-auto">
      <div className="mx-auto max-w-5xl space-y-6 p-6 pb-36">
        <PageHeader
          icon="Bell"
          title="notifications"
          description="manage_how_you_receive_notifications"
        />

        <Card>
          <CardHeader>
            <CardTitle translate="yes">email_notifications</CardTitle>
            <CardDescription translate="yes">
              choose_which_emails_you_want_to_receive
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NotificationsForm />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
