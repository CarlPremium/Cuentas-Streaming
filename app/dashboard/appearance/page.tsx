import * as React from 'react'

import { Separator } from '@/components/ui/separator'
import { PageHeader } from '@/app/dashboard/components/page-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon } from '@/lib/lucide-icon'

import { ChangeThemeForm } from './change-theme-form'
import { ChangeLanguageForm } from './change-language-form'

export default function AppearancePage() {
  return (
    <main className="flex-1 overflow-auto">
      <div className="space-y-6 p-6 pb-36 sm:p-8">
        <PageHeader
          title="Appearance"
          description="Customize how the dashboard looks and feels"
          icon="Paintbrush"
        />
        <Separator />
        
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Theme Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LucideIcon name="Palette" className="size-5" />
                Theme
              </CardTitle>
              <CardDescription>
                Choose between light, dark, or system theme preference
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChangeThemeForm />
            </CardContent>
          </Card>

          {/* Language Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LucideIcon name="Languages" className="size-5" />
                Language
              </CardTitle>
              <CardDescription>
                Select your preferred language for the dashboard interface
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChangeLanguageForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
