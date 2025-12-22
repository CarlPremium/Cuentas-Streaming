'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'

import { useForm, useFormContext } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TextLink } from '@/components/text-link'
import { Mail, Lock, Sparkles } from 'lucide-react'

import { createClient } from '@/supabase/client'
import { useAuth } from '@/hooks/use-auth'

const PasswordFormSchema = z.object({
  email: z.string().nonempty().max(255).email(),
  password: z.string().nonempty().min(6).max(72),
})

const MagicLinkFormSchema = z.object({
  email: z.string().nonempty().max(255).email(),
})

type PasswordFormValues = z.infer<typeof PasswordFormSchema>
type MagicLinkFormValues = z.infer<typeof MagicLinkFormSchema>

const SignInForm = () => {
  const [activeTab, setActiveTab] = React.useState('password')

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="password" className="gap-2">
          <Lock className="h-4 w-4" />
          <span className="hidden sm:inline">Contraseña</span>
        </TabsTrigger>
        <TabsTrigger value="magic" className="gap-2">
          <Sparkles className="h-4 w-4" />
          <span className="hidden sm:inline">Magic Link</span>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="password" className="mt-6">
        <PasswordForm />
      </TabsContent>
      <TabsContent value="magic" className="mt-6">
        <MagicLinkForm />
      </TabsContent>
    </Tabs>
  )
}

const PasswordForm = () => {
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(PasswordFormSchema),
    mode: 'onSubmit',
    defaultValues: {
      email: '',
      password: '',
    },
  })

  return (
    <Form {...form}>
      <form method="POST" noValidate className="space-y-4">
        <EmailField />
        <PasswordField />
        <SubmitButton />
      </form>
    </Form>
  )
}

const MagicLinkForm = () => {
  const form = useForm<MagicLinkFormValues>({
    resolver: zodResolver(MagicLinkFormSchema),
    mode: 'onSubmit',
    defaultValues: {
      email: '',
    },
  })

  return (
    <Form {...form}>
      <form method="POST" noValidate className="space-y-4">
        <MagicEmailField />
        <MagicLinkSubmitButton />
      </form>
    </Form>
  )
}

const EmailField = () => {
  const { t } = useTranslation()
  const { control } = useFormContext()

  return (
    <FormField
      control={control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            {t('email')}
          </FormLabel>
          <FormControl>
            <Input
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              placeholder="tu@ejemplo.com"
              className="h-11"
              {...field}
            />
          </FormControl>
          <FormMessage className="font-normal" />
        </FormItem>
      )}
    />
  )
}

const MagicEmailField = () => {
  const { t } = useTranslation()
  const { control } = useFormContext()

  return (
    <FormField
      control={control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            {t('email')}
          </FormLabel>
          <FormControl>
            <Input
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              placeholder="tu@ejemplo.com"
              className="h-11"
              {...field}
            />
          </FormControl>
          <FormDescription className="text-xs">
            Te enviaremos un enlace mágico para iniciar sesión sin contraseña
          </FormDescription>
          <FormMessage className="font-normal" />
        </FormItem>
      )}
    />
  )
}

const PasswordField = () => {
  const { t } = useTranslation()
  const { control } = useFormContext()

  return (
    <FormField
      control={control}
      name="password"
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center justify-between">
            <FormLabel className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              {t('password')}
            </FormLabel>
            <TextLink
              href="/auth/forgot-password"
              className="text-xs underline hover:no-underline"
              translate="yes"
            >
              forgot_your_password
            </TextLink>
          </div>
          <FormControl>
            <Input
              type="password"
              autoCapitalize="none"
              autoComplete="current-password"
              autoCorrect="off"
              placeholder="••••••••"
              className="h-11"
              {...field}
            />
          </FormControl>
          <FormMessage className="font-normal" />
        </FormItem>
      )}
    />
  )
}

const SubmitButton = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { t } = useTranslation()
  const { handleSubmit, setError, getValues } = useFormContext()
  const { setSession, setUser } = useAuth()

  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const onSubmit = async () => {
    try {
      setIsSubmitting(true)

      const next = (searchParams.get('next') as string) ?? '/dashboard'
      const formValues = getValues()

      const supabase = createClient()
      const signed = await supabase.auth.signInWithPassword({
        email: formValues?.email,
        password: formValues?.password,
      })
      if (signed?.error) throw new Error(signed?.error?.message)

      setSession(signed?.data?.session)
      setUser(signed?.data?.user)

      toast.success(t('you_have_successfully_logged_in'))

      router.refresh()
      router.replace(next)
    } catch (e: unknown) {
      const err = (e as Error)?.message
      if (err.startsWith('Invalid login credentials')) {
        setError('email', {
          message: t('invalid_login_credentials'),
        })
        setError('password', {
          message: t('invalid_login_credentials'),
        })
      } else {
        toast.error(err)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Button
      type="submit"
      onClick={handleSubmit(onSubmit)}
      disabled={isSubmitting}
      className="w-full h-11 font-semibold"
    >
      {isSubmitting ? 'Iniciando sesión...' : t('signin')}
    </Button>
  )
}

const MagicLinkSubmitButton = () => {
  const searchParams = useSearchParams()
  const { t } = useTranslation()
  const { handleSubmit, getValues } = useFormContext()

  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)
  const [emailSent, setEmailSent] = React.useState<boolean>(false)

  const onSubmit = async () => {
    try {
      setIsSubmitting(true)

      const next = (searchParams.get('next') as string) ?? '/dashboard'
      const formValues = getValues()

      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOtp({
        email: formValues?.email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${next}`,
        },
      })

      if (error) throw new Error(error.message)

      setEmailSent(true)
      toast.success('¡Enlace mágico enviado! Revisa tu correo electrónico.')
    } catch (e: unknown) {
      const err = (e as Error)?.message
      toast.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (emailSent) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center dark:border-green-800 dark:bg-green-950">
        <Mail className="mx-auto h-8 w-8 text-green-600 dark:text-green-400" />
        <p className="mt-2 text-sm font-medium text-green-900 dark:text-green-100">
          ¡Correo enviado!
        </p>
        <p className="mt-1 text-xs text-green-700 dark:text-green-300">
          Revisa tu bandeja de entrada y haz clic en el enlace para iniciar sesión
        </p>
      </div>
    )
  }

  return (
    <Button
      type="submit"
      onClick={handleSubmit(onSubmit)}
      disabled={isSubmitting}
      className="w-full h-11 font-semibold"
    >
      {isSubmitting ? (
        <>
          <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
          Enviando enlace...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Enviar Magic Link
        </>
      )}
    </Button>
  )
}

export { SignInForm }
