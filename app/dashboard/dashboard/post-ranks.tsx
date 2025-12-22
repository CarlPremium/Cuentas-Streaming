'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

import { usePostRank } from '@/queries/client/posts'
import { type User, type PostRank } from '@/types/database'

interface PostRanksProps extends React.HTMLAttributes<HTMLDivElement> {
  user: User
}

const PostRanks = ({ user, ...props }: PostRanksProps) => {
  const { t } = useTranslation()
  const { posts, isLoading } = usePostRank(user?.id, {
    // q: '',
    orderBy: 'views',
    order: 'desc',
    perPage: 10,
    page: 1,
  })

  if (isLoading) {
    return <Skeleton className="h-60 w-full" />
  }

  return (
    <Card className="flex h-full flex-col shadow-sm transition-shadow hover:shadow-md" {...props}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold">{t('post_views_top_%d', { count: 10 })}</CardTitle>
            <CardDescription className="text-sm">Most viewed posts</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        <div className="overflow-hidden rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="border-b">
                <th className="w-[40px] px-3 py-2 text-left font-medium">#</th>
                <th className="px-3 py-2 text-left font-medium">{t('post')}</th>
                <th className="w-[80px] px-3 py-2 text-right font-medium">{t('views')}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {Array.isArray(posts) && posts?.length > 0 ? (
                posts?.map((post: PostRank) => (
                  <ListItem key={post?.num} post={post} />
                ))
              ) : (
                <EmptyItem />
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

interface ListItemProps extends React.HTMLAttributes<HTMLTableRowElement> {
  post: PostRank
}

const ListItem = ({ post, ...props }: ListItemProps) => {
  return (
    <tr className="transition-colors hover:bg-muted/50" {...props}>
      <td className="px-3 py-3">
        <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
          {post?.num}
        </span>
      </td>
      <td className="px-3 py-3">
        <Link
          href={post?.path ?? '#'}
          className="line-clamp-1 font-medium transition-colors hover:text-primary hover:underline"
        >
          {post?.title}
        </Link>
      </td>
      <td className="px-3 py-3 text-right font-mono text-xs font-medium text-muted-foreground">
        {post?.views?.toLocaleString()}
      </td>
    </tr>
  )
}

const EmptyItem = () => {
  const { t } = useTranslation()

  return (
    <tr>
      <td colSpan={3} className="px-3 py-8 text-center">
        <p className="text-sm text-muted-foreground">{t('no_posts_yet')}</p>
      </td>
    </tr>
  )
}

export { PostRanks }
