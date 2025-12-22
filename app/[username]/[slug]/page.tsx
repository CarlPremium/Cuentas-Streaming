import * as React from 'react'
import type { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Forbidden } from '@/components/error'
import { EntryPublished, EntryAuthor, EntryTags } from '@/components/hentry'

import { PostViews } from './post-views'
import { FavoriteButton } from './favorite-button'
import { RelatedPosts } from './related-posts'

import { absoluteUrl, cn } from '@/lib/utils'
import { getTranslation } from '@/hooks/i18next'
import { getAuth, authenticate } from '@/queries/server/auth'
import { getUserAPI } from '@/queries/server/users'
import { getPostAPI, getAdjacentPostAPI } from '@/queries/server/posts'

import 'ckeditor5/ckeditor5.css'

// revalidate the data at most every month
// 3600 (hour), 86400 (day), 604800 (week), 2678400 (month), 31536000 (year)
// export const revalidate = 2678400

export async function generateMetadata(
  {
    params,
  }: {
    params: Promise<{ username: string; slug: string }>
  },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { username, slug } = await params
  const { user } = await getUserAPI(null, { username })
  const { post } = await getPostAPI(null, {
    userId: user?.id,
    slug: decodeURIComponent(slug),
  })

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL!),
    title: post?.title,
    description: post?.description,
    keywords: post?.keywords,
    openGraph: {
      type: 'website',
      siteName: process.env.NEXT_PUBLIC_APP_NAME!,
      title: post?.title ?? undefined,
      description: post?.description ?? undefined,
      images: post?.thumbnail_url ?? undefined,
    },
  }
}

export default async function PostPage({
  params,
  searchParams,
}: {
  params: Promise<{ username: string; slug: string }>
  searchParams?: Promise<{ preview?: string }>
}) {
  const { username, slug } = await params
  const { user } = await getUserAPI(null, { username })

  if (!user) notFound()

  const { post } = await getPostAPI(null, {
    userId: user?.id,
    slug: decodeURIComponent(slug),
  })

  if (!post) notFound()

  const resolvedSearchParams = searchParams ? await searchParams : {}

  if (
    ['future', 'private'].includes(post?.status) ||
    resolvedSearchParams?.preview === 'true'
  ) {
    const { authenticated } = await authenticate()
    const { session } = await getAuth()
    if (!authenticated) return <Forbidden />
    if (post?.user_id !== session?.user?.id) return <Forbidden />
  } else if (post?.status !== 'publish') {
    notFound()
  }

  const { previousPost, nextPost } = await getAdjacentPostAPI(post?.id, {
    userId: post?.user_id,
    postType: 'post',
    status: 'publish',
  })

  const { t } = await getTranslation()
  const { date, title, content, thumbnail_url, author, meta } = post

  return (
    <>
      <Header />
      <main className="min-h-[80vh] pb-20 sm:pb-40">
        <article className="container mx-auto max-w-4xl px-4 pt-8 sm:pt-12 lg:pt-16">
          {/* Title */}
          <PostTitle text={title} />
          
          {/* Meta Info */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b pb-6">
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <EntryPublished dateTime={date ?? undefined} />
              <span className="hidden sm:inline">—</span>
              <span className="hidden sm:inline">by</span>
              <EntryAuthor
                href={
                  author?.username ? absoluteUrl(`/${author?.username}`) : '#'
                }
                className="font-medium text-foreground underline decoration-muted-foreground underline-offset-2 transition-colors hover:text-primary hover:decoration-primary"
                author={author}
              />
            </div>
            <div className="flex items-center gap-4">
              <PostViews post={post} className="text-muted-foreground" />
              <FavoriteButton post={post} />
            </div>
          </div>

          {/* Cover Image */}
          <PostThumbnail
            className="mb-10 overflow-hidden rounded-xl shadow-lg sm:mb-12 lg:mb-16"
            backgroundImage={
              thumbnail_url ? `url(${thumbnail_url})` : undefined
            }
          />

          {/* Content */}
          <PostContent className="mb-12" __html={content} />

          {/* Tags */}
          <div className="mb-16 border-t pt-8">
            <EntryTags pathname={`/${username}`} meta={meta} />
          </div>

          {/* Related Posts */}
          <RelatedPosts previousPost={previousPost} nextPost={nextPost} t={t} />
        </article>
      </main>
      <Footer />
    </>
  )
}

interface PostTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  text: string | null
}

const PostTitle = ({ className, text, ...props }: PostTitleProps) => {
  return (
    <h1
      className={cn(
        'mb-6 font-serif text-4xl font-bold leading-tight tracking-tight text-foreground',
        'sm:mb-8 sm:text-5xl sm:leading-tight',
        'lg:text-6xl lg:leading-tight',
        className
      )}
      {...props}
    >
      {text}
    </h1>
  )
}

interface PostThumbnailProps extends React.HTMLAttributes<HTMLDivElement> {
  backgroundImage?: string
}

const PostThumbnail = ({ backgroundImage, className, ...props }: PostThumbnailProps) => {
  if (!backgroundImage) return null

  return (
    <div className={className} {...props}>
      <div
        className="aspect-video w-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage }}
      ></div>
    </div>
  )
}

interface PostContentProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    'dangerouslySetInnerHTML'
  > {
  __html: string | null
}

const PostContent = ({ className, __html, ...props }: PostContentProps) => {
  if (!__html) return null

  return (
    <div
      className={cn(
        'ck-content prose prose-lg max-w-none',
        'prose-headings:font-serif prose-headings:font-bold prose-headings:tracking-tight',
        'prose-p:text-foreground prose-p:leading-relaxed',
        'prose-a:text-primary prose-a:underline-offset-2 hover:prose-a:text-primary/80',
        'prose-img:rounded-lg prose-img:shadow-md',
        'prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5',
        'prose-pre:rounded-lg prose-pre:border prose-pre:bg-muted',
        className
      )}
      dangerouslySetInnerHTML={{ __html }}
      {...props}
    ></div>
  )
}
