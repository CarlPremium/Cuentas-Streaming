'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { SiteLogo } from '@/components/site-logo'
import { TextLink } from '@/components/text-link'
import { CountryFlagButton } from '@/components/country-flag-button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { SignInWithGoogle } from '@/components/signin-with-google'

import { SignInForm } from './signin-form'

export default function SignInPage() {
  const { t } = useTranslation()

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center">
      {/* Background gradient effect */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />
      
      {/* Language selector - top right */}
      <div className="absolute right-4 top-4 md:right-8 md:top-8">
        <CountryFlagButton />
      </div>

      <div className="container flex w-full flex-col items-center justify-center px-4 py-8">
        <Card className="mx-auto w-full max-w-[420px] shadow-lg">
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto">
              <SiteLogo className="mx-auto size-12 min-w-12" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold">
                {t('welcome_back')}
              </CardTitle>
              <CardDescription>
                {t('enter_your_credentials_to_access_your_account')}
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* OAuth Providers */}
            <div className="grid gap-3">
              <SignInWithGoogle className="w-full" />
            </div>

            {/* Separator */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  {t('or_continue_with')}
                </span>
              </div>
            </div>

            {/* Signin Form */}
            <SignInForm />

            {/* Sign up link */}
            <div className="text-center text-sm">
              <TextLink
                href="/auth/signup"
                className="text-muted-foreground underline-offset-4 hover:underline"
                translate="yes"
              >
                dont_have_an_account_sign_up
              </TextLink>
            </div>

            {/* Terms footer */}
            <div className="text-center text-xs text-muted-foreground">
              <TextLink
                href="/policy/terms"
                className="underline-offset-4 hover:underline"
                translate="yes"
              >
                terms_of_service
              </TextLink>
              {' · '}
              <TextLink
                href="/policy/privacy"
                className="underline-offset-4 hover:underline"
                translate="yes"
              >
                privacy_policy
              </TextLink>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
