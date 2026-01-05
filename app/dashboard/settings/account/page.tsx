import * as React from 'react'
import { redirect } from 'next/navigation'

import { Separator } from '@/components/ui/separator'
import { PageHeader } from '@/app/dashboard/components/page-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { LucideIcon } from '@/lib/lucide-icon'

import { ChangeUsernameForm } from './change-username-form'
import { DeleteUserForm } from './delete-user-form'

import { getUserAPI } from '@/queries/server/users'

export default async function AccountPage() {
  const { user } = await getUserAPI()

  if (!user) redirect('/auth/signin')

  return (
    <main className="flex-1 overflow-auto">
      <div className="space-y-6 p-6 pb-36 sm:p-8">
        <PageHeader
          title="Account Settings"
          description="Manage your account preferences and security"
          icon="UserCog"
        />
        <Separator />
        
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Username Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LucideIcon name="AtSign" className="size-5" />
                Username
              </CardTitle>
              <CardDescription>
                Change your unique username. This will affect your profile URL.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4">
                <LucideIcon name="CircleAlert" className="size-4" />
                <AlertDescription>
                  Changing your username may have unintended side effects, such as broken links.
                </AlertDescription>
              </Alert>
              <ChangeUsernameForm />
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <LucideIcon name="TriangleAlert" className="size-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>
                Irreversible actions that will permanently affect your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert variant="destructive" className="mb-4">
                <LucideIcon name="TriangleAlert" className="size-4" />
                <AlertDescription>
                  If you delete your account, all your posts and related information will be permanently deleted and cannot be recovered.
                </AlertDescription>
              </Alert>
              <DeleteUserForm user={user} />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
