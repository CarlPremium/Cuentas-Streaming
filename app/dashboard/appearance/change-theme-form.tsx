'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from 'next-themes'
import { useAppDispatch } from '@/lib/redux/hooks'
import { setAppTheme } from '@/store/reducers/app-reducer'

import { useForm, useFormContext } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { toast } from 'sonner'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Button } from '@/components/ui/button'

const FormSchema = z.object({
  theme: z.string(),
})

type FormValues = z.infer<typeof FormSchema>

const ChangeThemeForm = () => {
  const { theme } = useTheme()

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: 'onSubmit',
    values: { theme: 'dark' },
  })

  return (
    <Form {...form}>
      <form method="POST" noValidate className="space-y-4">
        <div className="rounded-lg border p-4 bg-card">
          <p className="text-sm text-muted-foreground">
            Dark mode is enabled by default for the best experience. Light mode has been disabled.
          </p>
        </div>
        <ThemeField />
      </form>
    </Form>
  )
}

const ThemeField = () => {
  const { control } = useFormContext()

  return (
    <FormField
      control={control}
      name="theme"
      render={({ field }) => (
        <FormItem className="space-y-1">
          <FormLabel className="mb-4 text-lg font-medium">Theme (Dark Mode Only)</FormLabel>
          <FormMessage />
          <RadioGroup
            onValueChange={field.onChange}
            defaultValue="dark"
            disabled
            className="grid max-w-md grid-cols-1 gap-8 pt-2"
          >
            <FormItem>
              <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                <FormControl>
                  <RadioGroupItem value="dark" className="sr-only" checked />
                </FormControl>
                <div className="items-center rounded-md border-2 border-primary bg-popover p-1">
                  <div className="space-y-2 rounded-sm bg-slate-950 p-2">
                    <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                      <div className="h-2 w-4/5 max-w-[80px] rounded-lg bg-slate-400" />
                      <div className="h-2 w-full max-w-[100px] rounded-lg bg-slate-400" />
                    </div>
                    <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                      <div className="h-4 w-4 rounded-full bg-slate-400" />
                      <div className="h-2 w-full max-w-[120px] rounded-lg bg-slate-400" />
                    </div>
                    <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                      <div className="h-4 w-4 rounded-full bg-slate-400" />
                      <div className="h-2 w-full max-w-[120px] rounded-lg bg-slate-400" />
                    </div>
                    <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                      <div className="h-4 w-4 rounded-full bg-slate-400" />
                      <div className="h-2 w-full max-w-[120px] rounded-lg bg-slate-400" />
                    </div>
                  </div>
                </div>
              </FormLabel>
            </FormItem>
          </RadioGroup>
        </FormItem>
      )}
    />
  )
}

const SubmitButton = () => {
  const dispatch = useAppDispatch()
  const { setTheme } = useTheme()
  const { t } = useTranslation()

  const { handleSubmit, getValues } = useFormContext()
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const onSubmit = () => {
    try {
      setIsSubmitting(true)

      const formValues = getValues()

      setTheme(formValues?.theme)
      dispatch(setAppTheme(formValues?.theme))

      toast.success(t('changed_successfully'))
    } catch (e: unknown) {
      toast.error((e as Error)?.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Button
      type="submit"
      onClick={handleSubmit(onSubmit)}
      disabled={isSubmitting}
    >
      {t('update_theme')}
    </Button>
  )
}

export { ChangeThemeForm }
