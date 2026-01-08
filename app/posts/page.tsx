import * as React from 'react'
import type { Metadata } from 'next'
import { Search, Filter, Calendar, User, Tag as TagIcon, TrendingUp, Clock, Eye, Sparkles } from 'lucide-react'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { LinkvertiseAd } from '@/components/ads/linkvertise-ad'
import { Paging, PagingProvider } from '@/components/paging'
import {
  EntryTitle,
  EntrySummary,
  EntryPublished,
  EntryAuthor,
  EntryTags,
} from '@/components/hentry'

import { absoluteUrl, cn } from '@/lib/utils'
import { generateSEOMetadata } from '@/lib/seo/metadata'
import { getTranslation } from '@/hooks/i18next'
import { getPostsAPI } from '@/queries/server/posts'
import { type Post } from '@/types/database'

import './posts.css'

// Revalidate every 30 minutes for fresh content
export const revalidate = 1800

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: Promise<{ tag?: string; q?: string }>
}): Promise<Metadata> {
  const params = await searchParams
  const tag = params?.tag
  const q = params?.q

  let title = 'Todas las Publicaciones'
  let description = 'Explora todas las publicaciones de nuestra comunidad. Encuentra contenido interesante sobre diversos temas.'

  if (tag) {
    title = `Publicaciones con #${tag}`
    description = `Explora todas las publicaciones etiquetadas con #${tag}. Descubre contenido relacionado con este tema.`
  }

  if (q) {
    title = `Búsqueda: ${q}`
    description = `Resultados de búsqueda para "${q}". Encuentra publicaciones relevantes en nuestra plataforma.`
  }

  return generateSEOMetadata({
    title,
    description,
    keywords: tag ? `${tag}, publicaciones, blog, contenido` : 'publicaciones, blog, contenido, comunidad',
    type: 'website',
  })
}

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
      <main className="blog-posts-page min-h-screen">
        {/* Modern Hero Section */}
        <div className="blog-hero">
          <div className="container relative z-10 py-12 sm:py-16 lg:py-20">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary backdrop-blur-sm">
                <Sparkles className="h-4 w-4" />
                <span>{tag ? `Explorando #${tag}` : 'Descubre Contenido Increíble'}</span>
              </div>
              
              <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                {tag ? (
                  <>
                    Publicaciones con{' '}
                    <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      #{tag}
                    </span>
                  </>
                ) : (
                  <>
                    Explora Nuestro{' '}
                    <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      Blog
                    </span>
                  </>
                )}
              </h1>
              
              <p className="mx-auto mb-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
                {tag 
                  ? `Descubre ${total} ${total === 1 ? 'publicación' : 'publicaciones'} relacionadas con este tema`
                  : `${total} ${total === 1 ? 'historia' : 'historias'} esperando ser descubiertas`
                }
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="blog-icon-container flex h-8 w-8 items-center justify-center rounded-lg">
                    <TagIcon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium">{total} Posts</span>
                </div>
                <span className="text-muted-foreground/50">•</span>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span>Contenido Actualizado</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container py-12 sm:py-16 lg:py-20">
          <PagingProvider value={{ total, page, perPage, pageSize }}>
            <div className="space-y-12">
              {/* Top Ad */}
              <div className="flex justify-center">
                <LinkvertiseAd width={728} height={90} className="hidden md:block" />
              </div>
              <div className="flex justify-center md:hidden">
                <LinkvertiseAd width={320} height={50} />
              </div>

              {Array.isArray(posts) && posts?.length > 0 ? (
                <>
                  <PostList posts={posts} />
                  <div className="flex justify-center pt-8">
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
      className="blog-grid"
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
  
  // Calculate reading time (rough estimate: 200 words per minute)
  const wordCount = description?.split(' ').length || 0
  const readingTime = Math.max(1, Math.ceil(wordCount / 200))

  return (
    <article 
      className="blog-card group"
      {...props}
    >
      {/* Thumbnail */}
      <PostThumbnail
        href={post?.permalink ?? '#'}
        backgroundImage={thumbnail_url ? `url(${thumbnail_url})` : undefined}
      />
      
      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        {/* Tags */}
        <div className="blog-tags">
          <EntryTags pathname="/posts" meta={meta} />
        </div>
        
        {/* Title */}
        <div className="flex-1">
          <a href={post?.permalink ?? '#'} className="block">
            <h3 className="blog-title">
              {title}
            </h3>
          </a>
        </div>
        
        {/* Description */}
        <EntrySummary 
          text={description} 
          className="line-clamp-3 text-sm leading-relaxed text-muted-foreground"
        />
        
        {/* Reading Time Badge */}
        <div className="reading-time">
          <Clock className="h-3.5 w-3.5" />
          <span>{readingTime} min lectura</span>
        </div>
        
        {/* Footer */}
        <div className="blog-meta">
          <div className="blog-meta-item">
            <Calendar className="h-3.5 w-3.5" />
            <EntryPublished dateTime={date ?? undefined} />
          </div>
          <span className="text-muted-foreground/50">•</span>
          <div className="blog-meta-item flex-1 truncate">
            <User className="h-3.5 w-3.5 flex-shrink-0" />
            <EntryAuthor
              href={username ? absoluteUrl(`/${username}`) : '#'}
              author={author}
              className="truncate hover:text-primary hover:underline"
            />
          </div>
        </div>
      </div>
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
      <a href={href} className="blog-thumbnail" {...props}>
        <div className="blog-thumbnail-placeholder">
          <div className="absolute inset-0 flex items-center justify-center">
            <TagIcon className="h-12 w-12 text-muted-foreground/20" />
          </div>
        </div>
      </a>
    )
  }

  return (
    <a href={href} className="blog-thumbnail" {...props}>
      <div
        className="blog-thumbnail-image"
        style={{ backgroundImage }}
      />
      <div className="blog-thumbnail-overlay" />
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
    <div className="blog-empty-state">
      <div className="blog-empty-icon">
        <Search className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="mb-3 text-2xl font-bold">{t('no_posts_found')}</h3>
      <p className="mx-auto mb-6 max-w-md text-muted-foreground">
        {tag 
          ? t('no_posts_with_this_tag')
          : t('no_posts_available_yet')}
      </p>
      {tag && (
        <a
          href="/posts"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground shadow-lg transition-all hover:scale-105 hover:bg-primary/90 hover:shadow-xl"
        >
          <TagIcon className="h-4 w-4" />
          {t('view_all_posts')}
        </a>
      )}
    </div>
  )
}
