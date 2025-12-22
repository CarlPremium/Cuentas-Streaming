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

import { usePostsAPI } from '@/queries/client/posts'
import { type Post, type User } from '@/types/database'

interface LatestPostsProps extends React.HTMLAttributes<HTMLDivElement> {
  user: User
}

const LatestPosts = ({ user, ...props }: LatestPostsProps) => {
  const { t } = useTranslation()
  const { posts, isLoading } = usePostsAPI(user?.id, {
    postType: 'post',
    status: 'publish',
    // q: '',
    orderBy: 'id',
    order: 'desc',
    // perPage: 5,
    // page: 1,
    limit: 5,
  })

  if (isLoading) {
    return <Skeleton className="h-60 w-full" />
  }

  return (
    <Card className="flex h-full flex-col shadow-sm transition-shadow hover:shadow-md" {...props}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold">{t('latest_posts')}</CardTitle>
            <CardDescription className="text-sm">Your most recent publications</CardDescription>
          </div>
          <Link 
            href="/dashboard/posts"
            className="text-sm font-medium text-primary hover:underline"
          >
            View all
          </Link>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        <div className="space-y-3">
          {Array.isArray(posts) && posts?.length > 0 ? (
            posts?.map((post: Post) => <ListItem key={post?.id} post={post} />)
          ) : (
            <EmptyItem />
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface ListItemProps extends React.HTMLAttributes<HTMLDivElement> {
  post: Post
}

const ListItem = ({ post, ...props }: ListItemProps) => {
  return (
    <div 
      className="group flex items-start gap-3 rounded-lg border border-transparent p-3 transition-all hover:border-border hover:bg-accent/50" 
      {...props}
    >
      <div className="mt-1 flex size-2 shrink-0 items-center justify-center">
        <div className="size-1.5 rounded-full bg-primary" />
      </div>
      <div className="flex-1 space-y-1">
        <Link
          href={`/dashboard/posts/edit?id=${post?.id}`}
          className="line-clamp-2 text-sm font-medium leading-snug text-foreground transition-colors group-hover:text-primary"
        >
          {post?.title}
        </Link>
        <p className="text-xs text-muted-foreground">
          {new Date(post?.date ?? '').toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </p>
      </div>
    </div>
  )
}

const EmptyItem = () => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
      <p className="text-sm text-muted-foreground">{t('no_posts_yet')}</p>
      <Link 
        href="/dashboard/posts" 
        className="mt-2 text-sm font-medium text-primary hover:underline"
      >
        Create your first post
      </Link>
    </div>
  )
}

export { LatestPosts }
