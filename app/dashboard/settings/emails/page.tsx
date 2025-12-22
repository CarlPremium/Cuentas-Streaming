import * as React from 'react'

import { PageHeader } from '@/app/dashboard/components/page-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import { EmailList } from './email-list'
import { AddEmail } from './components/add-email'
import { EditPrimaryEmail } from './components/edit-primary-email'

export default function EmailsPage() {
  return (
    <main className="flex-1 overflow-auto">
      <div className="mx-auto max-w-5xl space-y-6 p-6 pb-36">
        <PageHeader
          icon="Mail"
          title="emails"
          description="manage_your_email_addresses"
        />

        <Card>
          <CardHeader>
            <CardTitle translate="yes">email_addresses</CardTitle>
            <CardDescription translate="yes">
              manage_the_email_addresses_associated_with_your_account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <EmailList />
            <AddEmail />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle translate="yes">primary_email</CardTitle>
            <CardDescription translate="yes">
              set_your_primary_email_for_notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EditPrimaryEmail />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
