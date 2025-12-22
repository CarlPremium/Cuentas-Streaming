'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
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
import { Mail, Lock, CheckCircle2 } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

import { createClient } from '@/supabase/client'
import { useAuth } from '@/hooks/use-auth'

const FormSchema = z
  .object({
    email: z.string().nonempty().max(255).email(),
    newPassword: z.string().nonempty().min(6).max(72),
    confirmNewPassword: z.string().nonempty().min(6).max(72),
  })
  .refine((val) => val.newPassword === val.confirmNewPassword, {
    path: ['confirmNewPassword'],
    params: { i18n: 'invalid_confirm_password' },
  })

type FormValues = z.infer<typeof FormSchema>

const SignUpForm = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  })

  return (
    <Form {...form}>
      <form method="POST" noValidate className="space-y-4">
        <EmailField />
        <NewPasswordField />
        <ConfirmNewPasswordField />
        <SubmitButton />
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
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

const NewPasswordField = () => {
  const { t } = useTranslation()
  const { control, watch } = useFormContext()
  const password = watch('newPassword')

  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return 0
    let strength = 0
    if (pwd.length >= 6) strength += 25
    if (pwd.length >= 10) strength += 25
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength += 25
    if (/\d/.test(pwd)) strength += 15
    if (/[^a-zA-Z\d]/.test(pwd)) strength += 10
    return Math.min(strength, 100)
  }

  const strength = getPasswordStrength(password)
  const getStrengthColor = () => {
    if (strength < 40) return 'bg-red-500'
    if (strength < 70) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getStrengthText = () => {
    if (strength < 40) return 'Débil'
    if (strength < 70) return 'Media'
    return 'Fuerte'
  }

  return (
    <FormField
      control={control}
      name="newPassword"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            {t('password')}
          </FormLabel>
          <FormControl>
            <Input
              type="password"
              autoCapitalize="none"
              autoComplete="new-password"
              autoCorrect="off"
              placeholder="••••••••"
              className="h-11"
              {...field}
            />
          </FormControl>
          {password && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Seguridad:</span>
                <span className={`font-medium ${strength < 40 ? 'text-red-500' : strength < 70 ? 'text-yellow-500' : 'text-green-500'}`}>
                  {getStrengthText()}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                  style={{ width: `${strength}%` }}
                />
              </div>
            </div>
          )}
          <FormDescription className="text-xs">
            Mínimo 6 caracteres. Usa mayúsculas, números y símbolos para mayor seguridad.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

const ConfirmNewPasswordField = () => {
  const { t } = useTranslation()
  const { control, watch } = useFormContext()
  const password = watch('newPassword')
  const confirmPassword = watch('confirmNewPassword')

  const passwordsMatch = password && confirmPassword && password === confirmPassword

  return (
    <FormField
      control={control}
      name="confirmNewPassword"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            {t('confirm_password')}
          </FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                type="password"
                autoCapitalize="none"
                autoComplete="new-password"
                autoCorrect="off"
                placeholder="••••••••"
                className="h-11"
                {...field}
              />
              {passwordsMatch && (
                <CheckCircle2 className="absolute right-3 top-3 h-5 w-5 text-green-500" />
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

const SubmitButton = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const { handleSubmit, setError, getValues } = useFormContext()
  const { setSession, setUser } = useAuth()

  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const onSubmit = async () => {
    try {
      setIsSubmitting(true)

      const formValues = getValues()

      const supabase = await createClient()
      const signed = await supabase.auth.signUp({
        email: formValues?.email,
        password: formValues?.newPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (signed?.error) throw new Error(signed?.error?.message)

      const unsigned = await supabase.auth.signOut()
      if (unsigned?.error) throw new Error(unsigned?.error?.message)

      setSession(null)
      setUser(null)

      toast.success(t('you_have_successfully_registered_as_a_member'))
      toast.info('Revisa tu correo para verificar tu cuenta')

      router.refresh()
      router.replace('/auth/signin')
    } catch (e: unknown) {
      const err = (e as Error)?.message
      if (err.startsWith('User already registered')) {
        setError('email', {
          message: t('user_already_registered'),
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
      {isSubmitting ? 'Creando cuenta...' : t('signup')}
    </Button>
  )
}

export { SignUpForm }
