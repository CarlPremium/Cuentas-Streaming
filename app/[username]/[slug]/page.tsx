import * as React from 'react'
import type { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'
import { Calendar, User, Clock, Share2, Bookmark } from 'lucide-react'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { LinkvertiseAd } from '@/components/ads/linkvertise-ad'
import { Forbidden } from '@/components/error'
import { EntryPublished, EntryAuthor, EntryTags } from '@/components/hentry'
import { JsonLd } from '@/components/seo/json-ld'

import { FavoriteButton } from './favorite-button'
import { RelatedPosts } from './related-posts'
import { ReadingProgress } from './reading-progress'

import { absoluteUrl, cn, getBaseUrl } from '@/lib/utils'
import { generateBlogPostMetadata } from '@/lib/seo/metadata'
import { getTranslation } from '@/hooks/i18next'
import { getAuth, authenticate } from '@/queries/server/auth'
import { getUserAPI } from '@/queries/server/users'
import { getPostAPI, getAdjacentPostAPI } from '@/queries/server/posts'

import 'ckeditor5/ckeditor5.css'
import '../../posts/blog-post.css'

// Revalidate every 2 hours - published posts rarely change
export const revalidate = 7200

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

  if (!post) {
    return {
      title: 'Post no encontrado',
    }
  }

  return generateBlogPostMetadata({
    title: post.title || 'Sin título',
    description: post.description || undefined,
    image: post.thumbnail_url || undefined,
    slug: post.slug || slug,
    username: username,
    publishedTime: post.date || post.created_at,
    modifiedTime: post.updated_at,
    author: post.author?.username || username,
    keywords: post.keywords || undefined,
  })
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
  const baseUrl = getBaseUrl()

  return (
    <>
      <ReadingProgress />
      <JsonLd
        type="article"
        data={{
          title: title || 'Sin título',
          description: post.description,
          image: thumbnail_url || `${baseUrl}/og-image.png`,
          datePublished: date || post.created_at,
          dateModified: post.updated_at,
          authorName: author?.username || username,
          authorUrl: `${baseUrl}/${author?.username || username}`,
          url: `${baseUrl}/${username}/${slug}`,
          keywords: post.keywords,
        }}
      />
      <Header />
      <main className="blog-post-page min-h-[80vh] pb-20 sm:pb-40">
        <article className="container mx-auto max-w-4xl px-4 pt-8 sm:pt-12 lg:pt-16">
          {/* Title Section */}
          <div className="post-title-wrapper mb-8">
            <PostTitle text={title} />
          </div>
          
          {/* Meta Info Bar */}
          <div className="post-meta-bar">
            <div className="post-meta-info">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <EntryPublished dateTime={date ?? undefined} />
              </div>
              <span className="hidden text-muted-foreground/50 sm:inline">•</span>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">por</span>
                <EntryAuthor
                  href={
                    author?.username ? absoluteUrl(`/${author?.username}`) : '#'
                  }
                  className="post-author-link"
                  author={author}
                />
              </div>
            </div>
            <div className="post-actions">
              <FavoriteButton post={post} />
            </div>
          </div>

          {/* Cover Image */}
          {thumbnail_url && (
            <div className="post-cover">
              <img 
                src={thumbnail_url} 
                alt={title || 'Post cover'} 
                className="post-cover-image"
              />
            </div>
          )}

          {/* Ad after cover image */}
          <div className="flex justify-center my-8">
            <LinkvertiseAd width={728} height={90} className="hidden md:block" />
          </div>
          <div className="flex justify-center my-6 md:hidden">
            <LinkvertiseAd width={320} height={50} />
          </div>

          {/* Content */}
          <PostContent className="post-content mb-12" __html={content} />

          {/* Tags Section */}
          <div className="post-tags-section">
            <EntryTags pathname={`/${username}`} meta={meta} />
          </div>

          {/* Related Posts */}
          <div className="related-posts-section">
            <RelatedPosts previousPost={previousPost} nextPost={nextPost} t={t} />
          </div>
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
      className={cn('post-title', className)}
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
      className={cn('ck-content', className)}
      dangerouslySetInnerHTML={{ __html }}
      {...props}
    ></div>
  )
}
