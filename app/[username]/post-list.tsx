'use client'

import * as React from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { Calendar, Clock, Eye, ArrowRight } from 'lucide-react'

import { Paging, PagingProvider } from '@/components/paging'
import {
  EntryTitle,
  EntrySummary,
  EntryPublished,
  EntryTags,
} from '@/components/hentry'

import { type Post, type User } from '@/types/database'
import { usePostsAPI } from '@/queries/client/posts'
import { cn } from '@/lib/utils'

interface PostListProps extends React.HTMLAttributes<HTMLDivElement> {
  user: User
}

const PostList = ({ user, ...props }: PostListProps) => {
  const { t } = useTranslation()

  const searchParams = useSearchParams()
  const postType = 'post'
  const status = 'publish'
  const tag = searchParams.get('tag') as string
  const q = searchParams.get('q') as string
  const orderBy = (searchParams.get('orderBy') as string) ?? 'id'
  const order = (searchParams.get('order') as string) ?? 'desc'
  const perPage = +((searchParams.get('perPage') as string) ?? '10')
  const page = +((searchParams.get('page') as string) ?? '1')
  const pageSize = +((searchParams.get('pageSize') as string) ?? '10')

  const { posts, count } = usePostsAPI(user?.id, {
    postType,
    status,
    tag,
    q,
    orderBy,
    order,
    perPage,
    page,
  })

  const total = count ?? 0

  if (Array.isArray(posts) && posts?.length === 0) {
    return (
      <div {...props}>
        <div className="flex min-h-[200px] items-center justify-center rounded-xl border-2 border-dashed bg-muted/20 p-8 text-center">
          <p className="text-muted-foreground">{t('no_posts_yet')}</p>
        </div>
      </div>
    )
  }

  return (
    <PagingProvider value={{ total, page, perPage, pageSize }}>
      <div {...props}>
        <div className="grid grid-cols-1 gap-6">
          {posts?.map((post: Post) => <PostItem key={post?.id} post={post} />)}
        </div>
        <div className="mt-8">
          <Paging />
        </div>
      </div>
    </PagingProvider>
  )
}

interface PostItemProps extends React.HTMLAttributes<HTMLDivElement> {
  post: Post
}

const PostItem = ({ post, ...props }: PostItemProps) => {
  const username = post?.author?.username
  const wordCount = post?.description?.split(' ').length || 0
  const readingTime = Math.max(1, Math.ceil(wordCount / 200))

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-card transition-all duration-300",
        "hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
      )}
      {...props}
    >
      <div className="flex flex-col gap-4 p-0 md:flex-row">
        {/* Thumbnail */}
        <PostThumbnail
          href={post?.permalink ?? '#'}
          backgroundImage={post?.thumbnail_url ? `url(${post?.thumbnail_url})` : undefined}
          className="w-full md:w-64 md:flex-shrink-0"
        />
        
        {/* Content */}
        <div className="flex flex-1 flex-col justify-between gap-3 p-5 md:p-6">
          <div className="space-y-3">
            {/* Tags */}
            <EntryTags
              pathname={username ? `/${username}` : undefined}
              meta={post?.meta}
            />
            
            {/* Title */}
            <a href={post?.permalink ?? '#'} className="block">
              <h3 className={cn(
                "text-xl font-bold leading-tight transition-colors",
                "group-hover:text-primary",
                "line-clamp-2"
              )}>
                {post?.title}
              </h3>
            </a>
            
            {/* Description */}
            <EntrySummary 
              text={post?.description} 
              className="line-clamp-2 text-sm leading-relaxed text-muted-foreground"
            />
          </div>
          
          {/* Footer */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-primary" />
              <EntryPublished dateTime={post?.date ?? undefined} />
            </div>
            <span className="text-muted-foreground/50">•</span>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-primary" />
              <span>{readingTime} min lectura</span>
            </div>
            <a 
              href={post?.permalink ?? '#'}
              className="ml-auto flex items-center gap-1.5 font-medium text-primary transition-all hover:gap-2"
            >
              Leer más
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
      
      {/* Hover Border Effect */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary to-accent opacity-0 transition-opacity group-hover:opacity-100" />
    </article>
  )
}

interface PostThumbnailProps extends React.HTMLAttributes<HTMLAnchorElement> {
  href: string
  backgroundImage?: string
}

const PostThumbnail = ({ href, backgroundImage, className, ...props }: PostThumbnailProps) => {
  if (!backgroundImage) {
    return (
      <a href={href} className={cn("relative overflow-hidden", className)} {...props}>
        <div className="h-48 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 md:h-full md:min-h-48">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center">
              <Eye className="h-8 w-8 text-muted-foreground/30" />
            </div>
          </div>
        </div>
      </a>
    )
  }

  return (
    <a href={href} className={cn("relative overflow-hidden group/thumb", className)} {...props}>
      <div
        className="h-48 bg-cover bg-center bg-no-repeat transition-transform duration-500 group-hover/thumb:scale-110 md:h-full md:min-h-48"
        style={{ backgroundImage }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover/thumb:opacity-100" />
    </a>
  )
}

export { PostList, type PostListProps }
