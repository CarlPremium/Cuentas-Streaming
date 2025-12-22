import * as React from 'react'

import { Separator } from '@/components/ui/separator'
import { Title } from '@/components/title'
import { Description } from '@/components/description'
import { DashboardTabs } from '@/app/dashboard/components/dashboard-tabs'

import { AddTag } from './components/add-tag'
import { TagList } from './tag-list'

export default function TagsPage() {
  const tabs = [
    { href: '/dashboard/tags', label: 'all_tags', icon: 'Tags' as const },
    { href: '/dashboard/tags/popular', label: 'popular', icon: 'TrendingUp' as const, disabled: true },
  ]

  return (
    <>
      <DashboardTabs tabs={tabs} />
      <main className="flex-1 overflow-auto">
        <div className="space-y-6 p-6 pb-36 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-1">
              <Title translate="yes" className="text-2xl font-bold">tag_list</Title>
              <Description translate="yes" className="text-sm text-muted-foreground">
                create_and_manage_tags
              </Description>
            </div>
            <div className="flex gap-2">
              <AddTag 
                variant="default" 
                size="sm"
                startIconName="Plus" 
                translate="yes"
              >
                new_tag
              </AddTag>
            </div>
          </div>
          <Separator />
          <TagList />
        </div>
      </main>
    </>
  )
}
