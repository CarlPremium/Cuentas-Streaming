import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getUserAPI } from '@/queries/server/users'
import StoreManagement from './components/store-management'

export const metadata: Metadata = {
  title: 'Store Management',
  description: 'Manage products and orders',
}

export default async function StorePage() {
  const { user } = await getUserAPI()

  if (!user) {
    redirect('/auth/signin')
  }

  // Check if user is admin or superadmin
  if (!['admin', 'superadmin'].includes(user.role)) {
    redirect('/dashboard')
  }

  return <StoreManagement user={user} />
}
