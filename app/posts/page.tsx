import * as React from 'react'
import { Search, Filter, Calendar, User, Tag as TagIcon, TrendingUp } from 'lucide-react'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Paging, PagingProvider } from '@/components/paging'
import {
  EntryTitle,
  EntrySummary,
  EntryPublished,
  EntryAuthor,
  EntryTags,
} from '@/components/hentry'

import { absoluteUrl, cn } from '@/lib/utils'
import { getTranslation } from '@/hooks/i18next'
import { getPostsAPI } from '@/queries/server/posts'
import { type Post } from '@/types/database'

// revalidate the data at most every week
// 3600 (hour), 86400 (day), 604800 (week), 2678400 (month), 31536000 (year)
export const revalidate = 0

export default async function PostsPage({
  searchParams,
}: {
  searchParams?: Promise<{
    page?: string
    perPage?: string
    pageSize?: string
    tag?: string
    q?: string
    orderBy?: string
    order?: string
  }>
}) {
  const params = await searchParams
  const page = +(params?.page ?? '1')
  const perPage = +(params?.perPage ?? '10')
  const pageSize = +(params?.pageSize ?? '10')
  const tag = params?.tag
  const q = params?.q
  const orderBy = params?.orderBy ?? 'id'
  const order = params?.order ?? 'desc'

  const { posts, count } = await getPostsAPI(null, {
    page,
    perPage,
    postType: 'post',
    status: 'publish',
    tag,
    q,
    orderBy,
    order,
  })

  const total = count ?? 0
  const { t } = await getTranslation()

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Compact Header */}
        <div className="border-b bg-muted/30">
          <div className="container py-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <TagIcon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">
                    {tag ? `#${tag}` : t('posts')}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {total} {total === 1 ? t('post') : t('posts')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container py-8">
          <PagingProvider value={{ total, page, perPage, pageSize }}>
            <div className="space-y-8">
              {Array.isArray(posts) && posts?.length > 0 ? (
                <>
                  <PostList posts={posts} />
                  <div className="flex justify-center">
                    <Paging />
                  </div>
                </>
              ) : (
                <EmptyState tag={tag} t={t} />
              )}
            </div>
          </PagingProvider>
        </div>
      </main>
      <Footer />
    </>
  )
}

interface PostListProps extends React.HTMLAttributes<HTMLDivElement> {
  posts: Post[]
}

const PostList = ({ posts, ...props }: PostListProps) => {
  return (
    <div
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      {...props}
    >
      {posts?.map((post: Post) => <PostItem key={post?.id} post={post} />)}
    </div>
  )
}

interface PostItemProps extends React.HTMLAttributes<HTMLDivElement> {
  post: Post
}

const PostItem = ({ post, ...props }: PostItemProps) => {
  const { title, description, date, author, meta, thumbnail_url } = post
  const username = author?.username

  return (
    <article 
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-lg border bg-card",
        "shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/5",
        "hover:-translate-y-0.5"
      )}
      {...props}
    >
      {/* Thumbnail */}
      <PostThumbnail
        href={post?.permalink ?? '#'}
        backgroundImage={thumbnail_url ? `url(${thumbnail_url})` : undefined}
      />
      
      {/* Content */}
      <div className="flex flex-1 flex-col gap-2.5 p-4">
        {/* Tags */}
        <EntryTags pathname="/posts" meta={meta} />
        
        {/* Title */}
        <div className="flex-1">
          <EntryTitle 
            href={post?.permalink ?? '#'} 
            text={title}
            className="text-lg font-bold leading-snug transition-colors group-hover:text-primary"
          />
        </div>
        
        {/* Description */}
        <EntrySummary 
          text={description} 
          className="text-xs text-muted-foreground"
        />
        
        {/* Footer */}
        <div className="flex items-center gap-2 border-t pt-2.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <EntryPublished dateTime={date ?? undefined} />
          </div>
          <span className="text-muted-foreground/50">•</span>
          <div className="flex items-center gap-1 truncate">
            <User className="h-3 w-3 flex-shrink-0" />
            <EntryAuthor
              href={username ? absoluteUrl(`/${username}`) : '#'}
              author={author}
              className="truncate hover:text-primary hover:underline"
            />
          </div>
        </div>
      </div>
      
      {/* Hover Effect Overlay */}
      <div className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-primary opacity-0 transition-opacity group-hover:opacity-100" />
    </article>
  )
}

interface PostThumbnailProps extends React.HTMLAttributes<HTMLAnchorElement> {
  href: string
  backgroundImage?: string
}

const PostThumbnail = ({ href, backgroundImage, ...props }: PostThumbnailProps) => {
  if (!backgroundImage) {
    return (
      <a href={href} className="relative block" {...props}>
        <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-primary/10 via-accent/10 to-secondary">
          <div className="absolute inset-0 flex items-center justify-center">
            <TagIcon className="h-10 w-10 text-muted-foreground/20" />
          </div>
        </div>
      </a>
    )
  }

  return (
    <a href={href} className="relative block overflow-hidden" {...props}>
      <div
        className={cn(
          "relative aspect-[16/9] bg-cover bg-center bg-no-repeat",
          "transition-all duration-500 group-hover:scale-105"
        )}
        style={{ backgroundImage }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
    </a>
  )
}

// Empty State Component
interface EmptyStateProps {
  tag?: string
  t: (key: string) => string
}

const EmptyState = ({ tag, t }: EmptyStateProps) => {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border-2 border-dashed bg-muted/20 p-8 text-center">
      <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <Search className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mb-2 text-xl font-bold">{t('no_posts_found')}</h3>
      <p className="mb-4 max-w-md text-sm text-muted-foreground">
        {tag 
          ? t('no_posts_with_this_tag')
          : t('no_posts_available_yet')}
      </p>
      {tag && (
        <a
          href="/posts"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {t('view_all_posts')}
        </a>
      )}
    </div>
  )
}
