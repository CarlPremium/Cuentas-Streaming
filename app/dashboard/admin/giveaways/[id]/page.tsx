'use client'

import * as React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ArrowLeft, Users, Calendar, Trophy, Download } from 'lucide-react'

import { PageHeader } from '@/app/dashboard/components/page-header'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LucideIcon } from '@/lib/lucide-icon'
import { Skeleton } from '@/components/ui/skeleton'

interface Participant {
  id: number
  guest_name: string
  telegram_handle: string
  created_at: string
  ip_address?: string
}

interface Giveaway {
  id: number
  title: string
  description: string
  end_date: string
  status: string
  participant_count: number
  max_participants: number | null
  winner_guest_id: string | null
}

export default function GiveawayDetailPage() {
  const router = useRouter()
  const params = useParams()
  const giveawayId = params?.id as string

  const [giveaway, setGiveaway] = React.useState<Giveaway | null>(null)
  const [participants, setParticipants] = React.useState<Participant[]>([])
  const [loading, setLoading] = React.useState(true)
  const [page, setPage] = React.useState(1)
  const [totalPages, setTotalPages] = React.useState(1)

  React.useEffect(() => {
    if (giveawayId) {
      fetchGiveaway()
      fetchParticipants()
    }
  }, [giveawayId, page])

  const fetchGiveaway = async () => {
    try {
      const response = await fetch(`/api/v1/giveaway/${giveawayId}`)
      if (response.ok) {
        const data = await response.json()
        setGiveaway(data)
      } else {
        toast.error('Failed to load giveaway')
        router.push('/dashboard/admin/giveaways')
      }
    } catch (error) {
      toast.error('Error loading giveaway')
      router.push('/dashboard/admin/giveaways')
    }
  }

  const fetchParticipants = async () => {
    try {
      const response = await fetch(
        `/api/v1/giveaway/${giveawayId}/participants?page=${page}&per_page=50`
      )
      const data = await response.json()

      if (response.ok) {
        setParticipants(data.participants || [])
        setTotalPages(data.pagination.total_pages || 1)
      } else {
        toast.error('Failed to load participants')
      }
    } catch (error) {
      toast.error('Error loading participants')
    } finally {
      setLoading(false)
    }
  }

  const exportToCSV = () => {
    if (participants.length === 0) {
      toast.error('No participants to export')
      return
    }

    const headers = ['Name', 'Telegram', 'Joined At']
    const rows = participants.map(p => [
      p.guest_name,
      p.telegram_handle,
      new Date(p.created_at).toLocaleString()
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `giveaway-${giveawayId}-participants.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    toast.success('Participants exported to CSV')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-7xl space-y-6 p-6 pb-36">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-8 w-64" />
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </main>
    )
  }

  if (!giveaway) {
    return (
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-7xl space-y-6 p-6 pb-36">
          <p>Giveaway not found</p>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1 overflow-auto">
      <div className="mx-auto max-w-7xl space-y-6 p-6 pb-36">
        {/* Back Button & Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <PageHeader
            icon="Gift"
            title={giveaway.title}
            description="View giveaway details and participants"
          />
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Participants</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {giveaway.participant_count}
                {giveaway.max_participants && ` / ${giveaway.max_participants}`}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">End Date</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">
                {formatDate(giveaway.end_date)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Winner</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">
                {giveaway.winner_guest_id ? (
                  <Badge variant="outline" className="text-base">Selected</Badge>
                ) : (
                  <span className="text-muted-foreground">Not selected</span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Participants Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Participants</CardTitle>
                <CardDescription>
                  List of all participants in this giveaway
                </CardDescription>
              </div>
              <Button onClick={exportToCSV} variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {participants.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Users className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">No participants yet</h3>
                <p className="text-sm text-muted-foreground">
                  Participants will appear here once they join
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Telegram</TableHead>
                        <TableHead>Joined At</TableHead>
                        <TableHead>Winner</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {participants.map((participant) => (
                        <TableRow key={participant.id}>
                          <TableCell className="font-medium">
                            {participant.guest_name}
                          </TableCell>
                          <TableCell>{participant.telegram_handle}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDate(participant.created_at)}
                          </TableCell>
                          <TableCell>
                            {giveaway.winner_guest_id === participant.id.toString() && (
                              <Badge variant="default" className="gap-1">
                                <Trophy className="h-3 w-3" />
                                Winner
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {page} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
