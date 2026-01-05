import { redirect } from 'next/navigation'
import { getUserAPI } from '@/queries/server/users'

export default async function CreateGiveawayPage() {
  const { user } = await getUserAPI()
  
  // Only admins can create giveaways - redirect to admin dashboard
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin'
  
  if (!isAdmin) {
    redirect('/giveaways')
  }
  
  redirect('/dashboard/admin/giveaways/create')
}
