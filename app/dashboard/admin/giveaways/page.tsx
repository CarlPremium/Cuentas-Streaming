import * as React from 'react'
import Link from 'next/link'

import { PageHeader } from '@/app/dashboard/components/page-header'
import { Button } from '@/components/ui/button'
import { LucideIcon } from '@/lib/lucide-icon'
import { GiveawaysManagementTable } from './giveaways-table'

export default function AdminGiveawaysPage() {
  return (
    <main className="flex-1 overflow-auto">
      <div className="mx-auto max-w-7xl space-y-6 p-6 pb-36">
        <div className="flex items-center justify-between">
          <PageHeader
            icon="Gift"
            title="Manage Giveaways"
            description="Create, edit, and manage all giveaways"
          />
          <Link href="/dashboard/admin/giveaways/create">
            <Button size="lg" className="gap-2">
              <LucideIcon name="Plus" className="h-4 w-4" />
              Create Giveaway
            </Button>
          </Link>
        </div>

        <GiveawaysManagementTable />
      </div>
    </main>
  )
}
