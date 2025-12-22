'use client'

import * as React from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'

import { Paging, PagingProvider } from '@/components/paging'
import {
  EntryTitle,
  EntrySummary,
  EntryPublished,
  EntryTags,
} from '@/components/hentry'

import { type Post, type User } from '@/types/database'
import { usePostsAPI } from '@/queries/client/posts'

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
        <div className="py-4">{t('no_posts_yet')}</div>
      </div>
    )
  }

  return (
    <PagingProvider value={{ total, page, perPage, pageSize }}>
      <div {...props}>
        <div className="grid grid-cols-1">
          {posts?.map((post: Post) => <PostItem key={post?.id} post={post} />)}
        </div>
        <Paging />
      </div>
    </PagingProvider>
  )
}

interface PostItemProps extends React.HTMLAttributes<HTMLDivElement> {
  post: Post
}

const PostItem = ({ post, ...props }: PostItemProps) => {
  const username = post?.author?.username

  return (
    <div
      className="flex flex-row flex-wrap gap-4 border-b py-4 md:flex-nowrap"
      {...props}
    >
      <PostThumbnail
        href={post?.permalink ?? '#'}
        backgroundImage={post?.thumbnail_url ? `url(${post?.thumbnail_url})` : undefined}
        className="w-full md:w-48 md:flex-shrink-0"
      />
      <div className="flex-1 space-y-2">
        <EntryTitle href={post?.permalink ?? '#'} text={post?.title} />
        <EntrySummary text={post?.description} />
        <EntryTags
          pathname={username ? `/${username}` : undefined}
          meta={post?.meta}
        />
        <div className="w-full text-sm">
          <EntryPublished dateTime={post?.date ?? undefined} />
        </div>
      </div>
    </div>
  )
}

interface PostThumbnailProps extends React.HTMLAttributes<HTMLAnchorElement> {
  href: string
  backgroundImage?: string
}

const PostThumbnail = ({ href, backgroundImage, className, ...props }: PostThumbnailProps) => {
  if (!backgroundImage) {
    return (
      <a href={href} className={className} {...props}>
        <div className="h-32 bg-secondary md:h-full md:min-h-32"></div>
      </a>
    )
  }

  return (
    <a href={href} className={className} {...props}>
      <div
        className="h-32 bg-cover bg-center bg-no-repeat transition-transform hover:scale-105 md:h-full md:min-h-32"
        style={{ backgroundImage }}
      ></div>
    </a>
  )
}

export { PostList, type PostListProps }
