'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { z } from 'zod'

import { PageHeader } from '@/app/dashboard/components/page-header'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { LucideIcon } from '@/lib/lucide-icon'

const giveawaySchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  description: z.string().max(5000).optional(),
  thumbnail_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  end_date: z.string().min(1, 'End date is required'),
  max_participants: z.number().positive().optional(),
  is_featured: z.boolean().optional(),
  allow_guests: z.boolean().optional(),
})

export default function CreateGiveawayPage() {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    thumbnail_url: '',
    end_date: '',
    max_participants: '',
    is_featured: false,
    allow_guests: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate
      const data = giveawaySchema.parse({
        ...formData,
        max_participants: formData.max_participants
          ? parseInt(formData.max_participants)
          : undefined,
      })

      const response = await fetch('/api/v1/giveaway', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        toast.success('Giveaway created successfully!', {
          description: 'Your giveaway is now live',
        })
        router.push('/dashboard/admin/giveaways')
      } else {
        if (response.status === 401) {
          toast.error('Not authorized', {
            description: 'Please sign in to create giveaways',
          })
        } else if (response.status === 403) {
          toast.error('Access denied', {
            description: 'Only admins can create giveaways',
          })
        } else if (response.status === 429) {
          toast.error('Too many requests', {
            description: 'Please wait before creating another giveaway',
          })
        } else {
          toast.error(result.error || 'Failed to create giveaway')
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error('Validation error', {
          description: error.errors[0].message,
        })
      } else {
        toast.error('An error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  // Set minimum date to now
  const minDate = new Date().toISOString().slice(0, 16)

  return (
    <main className="flex-1 overflow-auto">
      <div className="mx-auto max-w-3xl space-y-6 p-6 pb-36">
        <PageHeader
          icon="Plus"
          title="Create Giveaway"
          description="Set up a new giveaway for your community"
        />

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Giveaway Details</CardTitle>
              <CardDescription>
                Fill in the information about your giveaway
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Netflix Premium 1 Year"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  maxLength={200}
                />
                <p className="text-xs text-muted-foreground">
                  A catchy title for your giveaway (3-200 characters)
                </p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Win a Netflix Premium account for 1 year! Enjoy unlimited streaming..."
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  maxLength={5000}
                />
                <p className="text-xs text-muted-foreground">
                  Describe what participants can win (optional, max 5000 characters)
                </p>
              </div>

              {/* Thumbnail URL */}
              <div className="space-y-2">
                <Label htmlFor="thumbnail_url">Thumbnail URL</Label>
                <Input
                  id="thumbnail_url"
                  name="thumbnail_url"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={formData.thumbnail_url}
                  onChange={handleChange}
                />
                <p className="text-xs text-muted-foreground">
                  Optional image URL for the giveaway card
                </p>
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <Label htmlFor="end_date">
                  End Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="end_date"
                  name="end_date"
                  type="datetime-local"
                  value={formData.end_date}
                  onChange={handleChange}
                  min={minDate}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  When the giveaway will end and stop accepting participants
                </p>
              </div>

              {/* Max Participants */}
              <div className="space-y-2">
                <Label htmlFor="max_participants">Maximum Participants</Label>
                <Input
                  id="max_participants"
                  name="max_participants"
                  type="number"
                  placeholder="1000"
                  value={formData.max_participants}
                  onChange={handleChange}
                  min={1}
                />
                <p className="text-xs text-muted-foreground">
                  Optional limit on how many people can join (leave empty for unlimited)
                </p>
              </div>

              {/* Featured */}
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="is_featured" className="text-base">
                    Featured Giveaway
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Show this giveaway prominently on the homepage
                  </p>
                </div>
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) =>
                    handleSwitchChange('is_featured', checked)
                  }
                />
              </div>

              {/* Allow Guests */}
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="allow_guests" className="text-base">
                    Allow Guest Participation
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Let anyone join without creating an account
                  </p>
                </div>
                <Switch
                  id="allow_guests"
                  checked={formData.allow_guests}
                  onCheckedChange={(checked) =>
                    handleSwitchChange('allow_guests', checked)
                  }
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={loading}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="flex-1 gap-2">
                  {loading ? (
                    <>
                      <LucideIcon name="Loader" className="h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <LucideIcon name="Check" className="h-4 w-4" />
                      Create Giveaway
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </main>
  )
}
