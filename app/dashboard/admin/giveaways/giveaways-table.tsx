'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

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
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LucideIcon } from '@/lib/lucide-icon'
import { Skeleton } from '@/components/ui/skeleton'

interface Giveaway {
  id: number
  title: string
  status: string
  end_date: string
  participant_count: number
  max_participants: number | null
  is_featured: boolean
  winner_guest_id: string | null
  winner_telegram_handle?: string | null
  winner_name?: string | null
}

export function GiveawaysManagementTable() {
  const router = useRouter()
  const [giveaways, setGiveaways] = React.useState<Giveaway[]>([])
  const [loading, setLoading] = React.useState(true)
  const [actionLoading, setActionLoading] = React.useState<number | null>(null)

  React.useEffect(() => {
    fetchGiveaways()
  }, [])

  const fetchGiveaways = async () => {
    try {
      const response = await fetch('/api/v1/giveaway?per_page=100')
      const data = await response.json()

      if (response.ok) {
        setGiveaways(data.giveaways || [])
      } else {
        toast.error('Failed to load giveaways')
      }
    } catch (error) {
      toast.error('Error loading giveaways')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectWinner = async (giveawayId: number) => {
    setActionLoading(giveawayId)
    try {
      const response = await fetch(
        `/api/v1/giveaway/${giveawayId}/select-winner`,
        {
          method: 'POST',
        }
      )

      const data = await response.json()

      if (response.ok && data.success) {
        const winnerInfo = data.telegram_handle 
          ? `${data.telegram_handle}${data.winner_name ? ` (${data.winner_name})` : ''}`
          : `ID: ${data.winner_guest_id || data.winner_id}`
        
        toast.success('Winner selected!', {
          description: `Winner: ${winnerInfo}`,
          duration: 10000,
        })
        fetchGiveaways()
      } else {
        toast.error(data.error || 'Failed to select winner')
      }
    } catch (error) {
      toast.error('Error selecting winner')
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (giveawayId: number) => {
    if (!confirm('Are you sure you want to delete this giveaway?')) return

    setActionLoading(giveawayId)
    try {
      const response = await fetch(`/api/v1/giveaway/${giveawayId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Giveaway deleted')
        fetchGiveaways()
      } else {
        toast.error('Failed to delete giveaway')
      }
    } catch (error) {
      toast.error('Error deleting giveaway')
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      active: 'default',
      running: 'secondary',
      ended: 'outline',
      cancelled: 'destructive',
    }

    return (
      <Badge variant={variants[status] || 'outline'}>
        {status.toUpperCase()}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>All Giveaways</CardTitle>
          <CardDescription>Loading giveaways...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Giveaways</CardTitle>
        <CardDescription>
          Manage all giveaways, select winners, and view statistics
        </CardDescription>
      </CardHeader>
      <CardContent>
        {giveaways.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <LucideIcon name="Gift" className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No giveaways yet</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Create your first giveaway to get started
            </p>
            <Button onClick={() => router.push('/dashboard/admin/giveaways/create')}>
              <LucideIcon name="Plus" className="mr-2 h-4 w-4" />
              Create Giveaway
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Participants</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Winner</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {giveaways.map((giveaway) => (
                  <TableRow key={giveaway.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {giveaway.title}
                        {giveaway.is_featured && (
                          <Badge variant="secondary" className="text-xs">
                            <LucideIcon name="Star" className="mr-1 h-3 w-3" />
                            Featured
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(giveaway.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <LucideIcon name="Users" className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {giveaway.participant_count}
                          {giveaway.max_participants && ` / ${giveaway.max_participants}`}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(giveaway.end_date)}
                    </TableCell>
                    <TableCell>
                      {giveaway.winner_guest_id ? (
                        <div className="flex flex-col gap-1">
                          <Badge variant="outline" className="gap-1 w-fit">
                            <LucideIcon name="Trophy" className="h-3 w-3" />
                            Winner
                          </Badge>
                          {giveaway.winner_telegram_handle && (
                            <span className="text-sm font-mono text-primary">
                              {giveaway.winner_telegram_handle}
                            </span>
                          )}
                          {giveaway.winner_name && (
                            <span className="text-xs text-muted-foreground">
                              {giveaway.winner_name}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={actionLoading === giveaway.id}
                          >
                            {actionLoading === giveaway.id ? (
                              <LucideIcon name="Loader" className="h-4 w-4 animate-spin" />
                            ) : (
                              <LucideIcon name="EllipsisVertical" className="h-4 w-4" />
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => router.push(`/dashboard/admin/giveaways/${giveaway.id}`)}
                          >
                            <LucideIcon name="Eye" className="mr-2 h-4 w-4" />
                            View Participants
                          </DropdownMenuItem>
                          {!giveaway.winner_guest_id && (
                            <DropdownMenuItem
                              onClick={() => handleSelectWinner(giveaway.id)}
                            >
                              <LucideIcon name="Trophy" className="mr-2 h-4 w-4" />
                              Select Winner
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => router.push(`/dashboard/admin/giveaways/edit/${giveaway.id}`)}
                          >
                            <LucideIcon name="Pencil" className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(giveaway.id)}
                            className="text-destructive"
                          >
                            <LucideIcon name="Trash2" className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
