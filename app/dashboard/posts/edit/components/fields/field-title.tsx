'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useFormContext } from 'react-hook-form'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const FieldTitle = () => {
  const { t } = useTranslation()
  const { control, formState } = useFormContext()
  const hasError = !!formState.errors.title

  React.useEffect(() => {
    if (hasError) {
      console.log('Title field has error:', formState.errors.title)
    }
  }, [hasError, formState.errors.title])

  return (
    <FormField
      control={control}
      name="title"
      render={({ field }) => (
        <FormItem>
          <FormLabel className={cn(
            'text-base font-semibold',
            hasError && 'text-destructive'
          )}>
            {t('title')}
            <span className="ml-1 text-destructive">*</span>
          </FormLabel>
          <FormControl>
            <Input
              placeholder={t('please_enter_your_text')}
              className={cn(
                'h-12 text-lg font-medium transition-colors',
                hasError && 'border-destructive focus-visible:ring-destructive bg-destructive/5'
              )}
              {...field}
            />
          </FormControl>
          <FormMessage className="text-sm font-medium" />
        </FormItem>
      )}
    />
  )
}

export { FieldTitle }
