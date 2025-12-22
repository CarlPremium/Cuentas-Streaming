import * as React from 'react'

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

import { absoluteUrl } from '@/lib/utils'
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
      <main className="min-h-[80vh] pb-20 sm:pb-40">
        <div className="container flex-1 overflow-auto">
          <h2 className="mt-16 text-center font-serif text-4xl font-bold">
            {tag ? `${t('tags')} : ${tag}` : t('posts')}
          </h2>
          <PagingProvider value={{ total, page, perPage, pageSize }}>
            <div className="mt-12 space-y-16">
              {Array.isArray(posts) && posts?.length > 0 ? (
                <>
                  <PostList posts={posts} />
                  <Paging />
                </>
              ) : (
                <div className="text-center">{t('no_posts_yet')}</div>
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
      className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
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
    <div className="space-y-2" {...props}>
      <PostThumbnail
        href={post?.permalink ?? '#'}
        backgroundImage={thumbnail_url ? `url(${thumbnail_url})` : undefined}
      />
      <EntryTitle href={post?.permalink ?? '#'} text={title} />
      <EntrySummary text={description} />
      <EntryTags pathname="/posts" meta={meta} />
      <div className="w-full text-sm">
        <EntryPublished dateTime={date ?? undefined} />
        <span> — by </span>
        <EntryAuthor
          href={username ? absoluteUrl(`/${username}`) : '#'}
          author={author}
        />
      </div>
    </div>
  )
}

interface PostThumbnailProps extends React.HTMLAttributes<HTMLAnchorElement> {
  href: string
  backgroundImage?: string
}

const PostThumbnail = ({ href, backgroundImage, ...props }: PostThumbnailProps) => {
  if (!backgroundImage) {
    return (
      <a href={href} {...props}>
        <div className="h-40 bg-secondary"></div>
      </a>
    )
  }

  return (
    <a href={href} {...props}>
      <div
        className="h-40 bg-cover bg-center bg-no-repeat transition-transform hover:scale-105"
        style={{ backgroundImage }}
      ></div>
    </a>
  )
}
