import * as React from 'react'
import { redirect } from 'next/navigation'

import { PageHeader } from '@/app/dashboard/components/page-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import { ChangePasswordForm } from './change-password-form'
import { Manage2FAForm } from './manage-2fa-form'

import { getUserAPI } from '@/queries/server/users'

export default async function SecurityPage() {
  const { user } = await getUserAPI()

  if (!user) redirect('/auth/signin')

  return (
    <main className="flex-1 overflow-auto">
      <div className="mx-auto max-w-5xl space-y-6 p-6 pb-36">
        <PageHeader
          icon="Shield"
          title="security"
          description="manage_your_password_and_security_settings"
        />

        <Card>
          <CardHeader>
            <CardTitle translate="yes">password</CardTitle>
            <CardDescription translate="yes">
              strengthen_your_account_by_keeping_your_password_strong
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChangePasswordForm user={user} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle translate="yes">two_factor_authentication</CardTitle>
            <CardDescription translate="yes">
              two_factor_authentication_is_a_method_of_adding_additional_security_to_your_account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Manage2FAForm user={user} />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
