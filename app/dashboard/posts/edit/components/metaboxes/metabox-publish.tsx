'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useFormContext } from 'react-hook-form'
import dayjs from 'dayjs'

import { toast } from 'sonner'
import { LucideIcon } from '@/lib/lucide-icon'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { usePostForm } from '@/app/dashboard/posts/edit/context/post-form-provider'

import { useSWRConfig } from 'swr'
import { fetcher, getMetaValue, relativeUrl } from '@/lib/utils'
import { type PostAPI } from '@/types/api'

const MetaboxPublish = () => {
  const { t } = useTranslation()
  const { post } = usePostForm()

  const visibility = getMetaValue(post?.meta, 'visibility')
  const views = getMetaValue(post?.meta, 'views', '0')
  const future_date = getMetaValue(post?.meta, 'future_date')

  const dateText = React.useMemo(() => {
    if (future_date) {
      const date = dayjs(future_date).format('YYYY-MM-DD HH:mm:ss')
      return `${t('future_date')}: ${date}`
    }

    if (post?.date) {
      const date = dayjs(post?.date).format('YYYY-MM-DD HH:mm:ss')
      return `${t('posted_on')}: ${date}`
    }

    return `${t('publish')}: ${t('immediately')}`
  }, [t, future_date, post?.date])

  return (
    <Accordion type="single" collapsible defaultValue="item-1">
      <AccordionItem value="item-1">
        <AccordionTrigger className="lg:pt-0">{t('publish')}</AccordionTrigger>
        <AccordionContent className="space-y-4">
          <div className="flex justify-between">
            <DraftButton />
            {post?.status === 'draft' ? <PreviewButton /> : <ViewButton />}
          </div>
          <ul className="space-y-1">
            <li className="flex items-center">
              <LucideIcon name="FileText" className="mr-2 size-4 min-w-4" />
              {`${t('status')}: `}
              {post?.status ? t(`${post?.status}`) : null}
            </li>
            <li className="flex items-center">
              <LucideIcon name="Eye" className="mr-2 size-4 min-w-4" />
              {`${t('visibility')}: `}
              {visibility === 'private' ? t('private') : t('public')}
            </li>
            <li className="flex items-center">
              <LucideIcon name="CalendarDays" className="mr-2 size-4 min-w-4" />
              {dateText}
            </li>
            <li className="flex items-center">
              <LucideIcon name="BarChart" className="mr-2 size-4 min-w-4" />
              {`${t('post_views')}: `}
              {+views?.toLocaleString()}
            </li>
          </ul>
          <div className="flex justify-between">
            <TrashButton />
            <PublishButton />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

const DraftButton = () => {
  const { t } = useTranslation()
  const { post } = usePostForm()
  const { getValues, handleSubmit, formState, trigger, setValue } = useFormContext()
  const { mutate } = useSWRConfig()

  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const onSubmit = async (data: any) => {
    console.log('DraftButton onSubmit called', { data })
    
    try {
      setIsSubmitting(true)

      if (!post) throw new Error('Require is not defined.')

      const formValues = getValues()
      const revalidatePaths = post?.permalink
        ? relativeUrl(post?.permalink)
        : null

      console.log('Saving draft:', { formValues, revalidatePaths })

      const result = await fetcher<PostAPI>(`/api/v1/post?id=${post?.id}`, {
        method: 'POST',
        body: JSON.stringify({
          data: { ...formValues, status: 'draft' },
          options: { revalidatePaths },
        }),
      })

      console.log('Draft save result:', result)

      if (result?.error) throw new Error(result?.error?.message)

      mutate(`/api/v1/post?id=${post?.id}`)

      toast.success(t('changed_successfully'))
    } catch (e: unknown) {
      console.error('Draft save error:', e)
      toast.error((e as Error)?.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const onError = (errors: any) => {
    console.log('Draft validation errors:', errors)
    toast.error('Errores de validación', {
      description: 'Por favor corrige los errores en el formulario',
    })
  }

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    console.log('DraftButton clicked')
    
    // Check if user_id is missing and try to fix it
    const currentValues = getValues()
    if (!currentValues.user_id && post?.user_id) {
      console.log('user_id missing, setting from post:', post.user_id)
      setValue('user_id', post.user_id, { shouldValidate: true })
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    // Trigger validation
    const isValid = await trigger()
    console.log('Draft validation result:', isValid, formState.errors)
    
    if (!isValid) {
      onError(formState.errors)
      return
    }
    
    handleSubmit(onSubmit, onError)()
  }

  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      onClick={handleClick}
      disabled={isSubmitting}
    >
      {t('save_draft')}
    </Button>
  )
}

const ViewButton = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const { post } = usePostForm()

  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    console.log('ViewButton clicked')
    
    try {
      setIsSubmitting(true)
      if (post?.permalink) {
        console.log('Navigating to:', post?.permalink)
        router.push(post?.permalink)
      }
    } catch (e: unknown) {
      console.error('View error:', e)
      toast.error((e as Error)?.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      onClick={handleClick}
      disabled={isSubmitting}
    >
      {t('view')}
    </Button>
  )
}

const PreviewButton = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const { post } = usePostForm()
  const { getValues, handleSubmit, formState, trigger, setValue } = useFormContext()
  const { mutate } = useSWRConfig()

  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const onSubmit = async (data: any) => {
    console.log('PreviewButton onSubmit called', { data })
    
    try {
      setIsSubmitting(true)

      if (!post) throw new Error('Require is not defined.')

      const formValues = getValues()
      const revalidatePaths = post?.permalink
        ? relativeUrl(post?.permalink)
        : null

      console.log('Saving for preview:', { formValues, revalidatePaths })

      const { error } = await fetcher<PostAPI>(`/api/v1/post?id=${post?.id}`, {
        method: 'POST',
        body: JSON.stringify({
          data: { ...formValues, status: 'draft' },
          options: { revalidatePaths },
        }),
      })

      if (error) throw new Error(error?.message)

      mutate(`/api/v1/post?id=${post?.id}`)

      if (post?.permalink) {
        console.log('Navigating to preview:', `${post?.permalink}?preview=true`)
        router.push(`${post?.permalink}?preview=true`)
      }
    } catch (e: unknown) {
      console.error('Preview error:', e)
      toast.error((e as Error)?.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const onError = (errors: any) => {
    console.log('Preview validation errors:', errors)
    toast.error('Errores de validación', {
      description: 'Por favor corrige los errores en el formulario',
    })
  }

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    console.log('PreviewButton clicked')
    
    // Check if user_id is missing and try to fix it
    const currentValues = getValues()
    if (!currentValues.user_id && post?.user_id) {
      console.log('user_id missing, setting from post:', post.user_id)
      setValue('user_id', post.user_id, { shouldValidate: true })
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    // Trigger validation
    const isValid = await trigger()
    console.log('Preview validation result:', isValid, formState.errors)
    
    if (!isValid) {
      onError(formState.errors)
      return
    }
    
    handleSubmit(onSubmit, onError)()
  }

  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      onClick={handleClick}
      disabled={isSubmitting}
    >
      {t('preview')}
    </Button>
  )
}

const TrashButton = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const { post } = usePostForm()

  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    console.log('TrashButton clicked')
    
    try {
      setIsSubmitting(true)

      if (!post) throw new Error('Require is not defined.')

      const now = new Date().toISOString()
      const revalidatePaths = post?.permalink
        ? relativeUrl(post?.permalink)
        : null

      console.log('Moving to trash:', { post_id: post?.id, revalidatePaths })

      const { error } = await fetcher<PostAPI>(`/api/v1/post?id=${post?.id}`, {
        method: 'POST',
        body: JSON.stringify({
          data: { status: 'trash', deleted_at: now, user_id: post?.user_id },
          options: { revalidatePaths },
        }),
      })

      if (error) throw new Error(error?.message)

      toast.success(t('changed_successfully'))

      console.log('Navigating to posts list')
      router.push('/dashboard/posts')
    } catch (e: unknown) {
      console.error('Trash error:', e)
      toast.error((e as Error)?.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Button
      type="button"
      variant="link"
      className="h-auto p-0 text-destructive underline hover:no-underline dark:text-white"
      size="sm"
      onClick={handleClick}
      disabled={isSubmitting}
    >
      {t('move_to_trash')}
    </Button>
  )
}

const PublishButton = () => {
  const { t } = useTranslation()
  const { post } = usePostForm()
  const { getValues, handleSubmit, formState, trigger, setValue } = useFormContext()
  const { mutate } = useSWRConfig()

  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const onSubmit = async (data: any) => {
    console.log('PublishButton onSubmit called', { data, errors: formState.errors })
    
    try {
      setIsSubmitting(true)

      if (!post) {
        console.error('Post not found')
        toast.error('Error', {
          description: 'No se pudo encontrar la publicación',
        })
        return
      }

      const formValues = getValues()
      console.log('Form values:', formValues)
      console.log('Form values types:', {
        user_id: typeof formValues.user_id,
        date: typeof formValues.date,
        title: typeof formValues.title,
        slug: typeof formValues.slug,
        description: typeof formValues.description,
        keywords: typeof formValues.keywords,
        content: typeof formValues.content,
        thumbnail_url: typeof formValues.thumbnail_url,
        permalink: typeof formValues.permalink,
        meta: Array.isArray(formValues.meta) ? 'array' : typeof formValues.meta,
      })

      const visibility = getMetaValue(formValues?.meta, 'visibility')
      const future_date = getMetaValue(formValues?.meta, 'future_date')

      let status: string = visibility === 'private' ? 'private' : 'publish'
      if (future_date) status = 'future'

      const submitData = { ...formValues, status }
      const now = new Date().toISOString()
      const revalidatePaths = post?.permalink
        ? relativeUrl(post?.permalink)
        : null

      console.log('Submitting to API:', { submitData, revalidatePaths })

      // Show loading toast
      const loadingToast = toast.loading('Guardando cambios...')

      const result = await fetcher<PostAPI>(`/api/v1/post?id=${post?.id}`, {
        method: 'POST',
        body: JSON.stringify({
          data: post?.date ? submitData : { ...submitData, date: now },
          options: { revalidatePaths },
        }),
      })

      console.log('API response:', result)

      // Dismiss loading toast
      toast.dismiss(loadingToast)

      if (result?.error) {
        console.error('API error:', result.error)
        toast.error('Error al guardar', {
          description: result?.error?.message || 'No se pudo guardar la publicación',
        })
        return
      }

      // Success!
      mutate(`/api/v1/post?id=${post?.id}`)
      
      toast.success('¡Publicación guardada!', {
        description: status === 'publish' 
          ? 'Tu publicación ha sido publicada exitosamente' 
          : status === 'future'
          ? 'Tu publicación ha sido programada'
          : 'Los cambios han sido guardados',
      })
    } catch (e: unknown) {
      const error = e as Error
      console.error('Unexpected error:', error)
      console.error('Error stack:', error.stack)
      toast.error('Error inesperado', {
        description: error?.message || 'Ocurrió un error al guardar la publicación',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const onError = (errors: any) => {
    console.log('Validation errors:', errors)
    
    // Log each error in detail
    Object.keys(errors).forEach(key => {
      console.log(`Field "${key}" error:`, errors[key]?.message)
    })
    
    // Create user-friendly error message
    const errorFields = Object.keys(errors)
    const userFriendlyErrors = errorFields
      .filter(key => key !== 'user_id') // Don't show technical errors to user
      .map(key => {
        const fieldNames: Record<string, string> = {
          title: 'Título',
          slug: 'Slug',
          permalink: 'Permalink',
          description: 'Descripción',
          keywords: 'Palabras clave',
          content: 'Contenido',
          thumbnail_url: 'URL de imagen',
        }
        return `${fieldNames[key] || key}: ${errors[key]?.message}`
      })
    
    if (errors.user_id) {
      // Technical error - log it but show generic message to user
      console.error('CRITICAL: user_id is missing from form')
      toast.error('Error técnico', {
        description: 'Hay un problema con la sesión. Por favor recarga la página.',
      })
    } else if (userFriendlyErrors.length > 0) {
      toast.error('Errores de validación', {
        description: userFriendlyErrors.join(', '),
      })
    } else {
      toast.error('Errores de validación', {
        description: 'Por favor corrige los errores en el formulario antes de publicar',
      })
    }
  }

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    console.log('PublishButton clicked')
    
    // Get current form values
    const currentValues = getValues()
    console.log('Current form values:', currentValues)
    
    // Check if user_id is missing and try to fix it
    if (!currentValues.user_id && post?.user_id) {
      console.log('user_id missing, setting from post:', post.user_id)
      setValue('user_id', post.user_id, { shouldValidate: true })
      // Wait a bit for the value to be set
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    // Trigger validation for all fields
    const isValid = await trigger()
    console.log('Form validation result:', isValid)
    console.log('Form errors:', formState.errors)
    
    if (!isValid) {
      onError(formState.errors)
      return
    }
    
    handleSubmit(onSubmit, onError)()
  }

  return (
    <Button
      type="button"
      variant="default"
      size="sm"
      onClick={handleClick}
      disabled={isSubmitting}
    >
      {isSubmitting ? (
        <>
          <LucideIcon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
          {t('saving')}...
        </>
      ) : (
        post?.status === 'draft' ? t('publish') : t('update')
      )}
    </Button>
  )
}

export { MetaboxPublish }
