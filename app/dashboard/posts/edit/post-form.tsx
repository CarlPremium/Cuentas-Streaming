'use client'

import * as React from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'

import { Form } from '@/components/ui/form'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

import { FieldMeta, FieldTitle, FieldUserId } from './components/fields'
import {
  MetaboxSlug,
  MetaboxPermalink,
  MetaboxDescription,
  MetaboxKeywords,
  MetaboxRevisions,
  MetaboxThumbnail,
  MetaboxPublish,
  MetaboxRectriction,
  MetaboxFutureDate,
  MetaboxTags,
} from './components/metaboxes'
import { PostFormProvider } from './context/post-form-provider'
import { usePostAPI } from '@/queries/client/posts'

const Editor = dynamic(() => import('./components/ckeditor5/editor'), {
  ssr: false,
  loading: () => <Skeleton className="h-96 w-full rounded-lg" />,
})

const FormSchema = z.object({
  user_id: z.string().min(1, 'El ID de usuario es requerido').uuid('ID de usuario inválido'),
  date: z.string().optional().or(z.literal('')),
  title: z.string().min(1, 'El título es requerido').min(3, 'El título debe tener al menos 3 caracteres'),
  slug: z.string().min(1, 'El slug es requerido').min(3, 'El slug debe tener al menos 3 caracteres'),
  description: z.string().optional().or(z.literal('')),
  keywords: z.string().optional().or(z.literal('')),
  content: z.string().optional().or(z.literal('')),
  thumbnail_url: z.string().optional().or(z.literal('')).refine(
    (val) => !val || val === '' || z.string().url().safeParse(val).success,
    { message: 'URL inválida' }
  ),
  permalink: z.string().min(1, 'El permalink es requerido'),
  meta: z.array(z.record(z.string(), z.any())).optional(),
})

type FormValues = z.infer<typeof FormSchema>

const PostForm = ({ id }: { id: number }) => {
  const router = useRouter()
  const { t } = useTranslation()
  const { post, isLoading, error } = usePostAPI(id)

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: 'onChange',
    defaultValues: {
      user_id: '',
      date: '',
      title: '',
      slug: '',
      description: '',
      keywords: '',
      content: '',
      thumbnail_url: '',
      permalink: '',
      meta: [],
    },
    values: post ? {
      user_id: post.user_id || '',
      date: post.date || '',
      title: post.title || '',
      slug: post.slug || '',
      description: post.description || '',
      keywords: post.keywords || '',
      content: post.content || '',
      thumbnail_url: post.thumbnail_url || '',
      permalink: post.permalink || '',
      meta: post.meta || [],
    } : undefined,
    shouldUnregister: true,
  })

  // Only log when post is loaded
  React.useEffect(() => {
    if (post && post.user_id) {
      console.log('Post loaded successfully:', {
        id: post.id,
        user_id: post.user_id,
        title: post.title
      })
    }
  }, [post])

  // Show error if post fetch failed
  React.useEffect(() => {
    if (error) {
      toast.error('Error al cargar la publicación', {
        description: error.message || 'No se pudo cargar la publicación. Verifica que existe y tienes permisos.',
      })
    }
  }, [error])

  if (isLoading) {
    return (
      <div className="relative grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="mx-auto w-full min-w-0 space-y-6">
          <Skeleton className="h-14 w-full rounded-lg" />
          <Skeleton className="h-96 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-60 w-full rounded-lg" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-60 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <Alert variant="destructive" className="max-w-2xl">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error al cargar la publicación</AlertTitle>
        <AlertDescription className="mt-2 space-y-3">
          <p>
            {error?.message || 'No se pudo cargar la publicación. Verifica que existe y tienes permisos para editarla.'}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/dashboard/posts')}
            >
              Volver a publicaciones
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.refresh()}
            >
              Reintentar
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  // Don't render form until post data is loaded
  if (!post?.user_id) {
    console.error('Post loaded but user_id is missing:', post)
    return (
      <Alert variant="destructive" className="max-w-2xl">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error de datos</AlertTitle>
        <AlertDescription className="mt-2 space-y-3">
          <p>
            La publicación no tiene un usuario asociado. Esto puede indicar un problema con los datos.
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/dashboard/posts')}
            >
              Volver a publicaciones
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <PostFormProvider value={{ post }}>
      <Form {...form}>
        <FieldUserId />
        <FieldMeta />
        <form method="POST" noValidate>
          <div className="relative grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-6">
              <div className="space-y-3 rounded-lg border bg-card p-6 shadow-sm">
                <FieldTitle />
                <MetaboxPermalink className="text-sm text-muted-foreground" />
              </div>
              
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <Editor initialData={post?.content ?? ''} />
              </div>

              <div className="space-y-4 rounded-lg border bg-card p-6 shadow-sm">
                <h3 className="text-lg font-semibold">SEO y Metadatos</h3>
                <MetaboxSlug />
                <MetaboxDescription />
                <MetaboxKeywords />
              </div>
            </div>
            
            <div className="space-y-4">
              <MetaboxPublish />
              <MetaboxFutureDate />
              <MetaboxRectriction />
              <MetaboxThumbnail />
              <MetaboxTags />
            </div>
          </div>
        </form>
      </Form>
    </PostFormProvider>
  )
}

export { PostForm }
