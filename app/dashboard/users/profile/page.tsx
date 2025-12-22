import * as React from 'react'

import { Separator } from '@/components/ui/separator'
import { PageHeader } from '@/app/dashboard/components/page-header'

import { ProfileForm } from './profile-form'

export default function ProfilePage() {
  return (
    <main className="flex-1 overflow-auto">
      <div className="space-y-6 p-6 pb-36 sm:p-8">
        <PageHeader
          title="Profile"
          description="Manage your public profile information and settings"
          icon="User"
        />
        <Separator />
        <div className="mx-auto max-w-4xl">
          <ProfileForm />
        </div>
      </div>
    </main>
  )
}
