import * as React from 'react'

import { Separator } from '@/components/ui/separator'
import { Title } from '@/components/title'
import { Description } from '@/components/description'
import { DashboardTabs } from '@/app/dashboard/components/dashboard-tabs'

import { AddDummyPost } from './components/add-dummy-post'
import { AddPost } from './components/add-post'
import { PostList } from './post-list'

export default function PostsPage() {
  const tabs = [
    { href: '/dashboard/posts', label: 'all_posts', icon: 'FileText' as const },
    { href: '/dashboard/posts/published', label: 'published', icon: 'CheckCircle' as const, disabled: true },
    { href: '/dashboard/posts/drafts', label: 'drafts', icon: 'Edit' as const, disabled: true },
    { href: '/dashboard/posts/scheduled', label: 'scheduled', icon: 'Clock' as const, disabled: true },
  ]

  return (
    <>
      <DashboardTabs tabs={tabs} />
      <main className="flex-1 overflow-auto">
        <div className="space-y-6 p-6 pb-36 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-1">
              <Title translate="yes" className="text-2xl font-bold">post_list</Title>
              <Description translate="yes" className="text-sm text-muted-foreground">
                create_and_manage_posts
              </Description>
            </div>
            <div className="flex flex-wrap gap-2">
              <AddDummyPost
                variant="outline"
                size="sm"
                startIconName="CopyPlus"
                translate="yes"
              >
                dummy_post
              </AddDummyPost>
              <AddPost 
                variant="default" 
                size="sm"
                startIconName="Plus" 
                translate="yes"
              >
                new_post
              </AddPost>
            </div>
          </div>
          <Separator />
          <PostList />
        </div>
      </main>
    </>
  )
}
