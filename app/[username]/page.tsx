import * as React from 'react'
import type { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'
import { Mail, Calendar, MapPin, Link as LinkIcon, Shield, Star, Users, Award } from 'lucide-react'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

import { absoluteUrl, getMetaValue, getBaseUrl, cn } from '@/lib/utils'
import { generateProfileMetadata } from '@/lib/seo/metadata'
import { getTranslation } from '@/hooks/i18next'
import { getUserAPI } from '@/queries/server/users'

import './profile.css'

// Revalidate every hour - profiles don't change often
export const revalidate = 3600

export async function generateMetadata(
  {
    params,
  }: {
    params: Promise<{ username: string }>
  },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { username } = await params
  const { user } = await getUserAPI(null, { username })

  if (!user) {
    return {
      title: 'Usuario no encontrado',
    }
  }

  const fullName = getMetaValue(user?.meta, 'full_name')
  const bio = getMetaValue(user?.meta, 'bio')
  const avatarUrl = getMetaValue(user?.meta, 'avatar_url')

  return generateProfileMetadata({
    username,
    fullName: fullName || undefined,
    bio: bio || undefined,
    avatar: avatarUrl || undefined,
  })
}

export default async function UsernamePage({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params
  const { user } = await getUserAPI(null, { username })

  if (!user) notFound()

  const { t } = await getTranslation()
  
  // Extract user metadata
  const avatarUrl = getMetaValue(user?.meta, 'avatar_url')
  const fullName = getMetaValue(user?.meta, 'full_name')
  const bio = getMetaValue(user?.meta, 'bio')
  const location = getMetaValue(user?.meta, 'location')
  const website = getMetaValue(user?.meta, 'website')
  
  // Format dates
  const joinDate = user?.created_at 
    ? new Date(user.created_at).toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long' 
      })
    : null

  return (
    <>
      <Header />
      <main className="profile-page pb-20">
        {/* Hero Section */}
        <div className="profile-hero">
          <div className="container relative z-10 py-16 sm:py-20 lg:py-24">
            <div className="mx-auto max-w-5xl">
              <div className="flex flex-col items-center gap-8 text-center sm:flex-row sm:text-left">
                {/* Avatar */}
                <div className="profile-avatar-container">
                  <div className="profile-avatar-ring" />
                  <Avatar className="profile-avatar">
                    <AvatarImage
                      src={avatarUrl || undefined}
                      alt={`@${username}`}
                    />
                    <AvatarFallback className="text-5xl font-bold">
                      {username?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Info */}
                <div className="profile-info flex-1">
                  <h1 className="profile-name mb-2">
                    {fullName || username}
                  </h1>
                  <p className="profile-username mb-4">
                    {username}
                  </p>
                  
                  {/* Role Badge */}
                  {user?.role && user.role !== 'user' && (
                    <div className="mb-4">
                      <Badge 
                        variant={user.role === 'admin' || user.role === 'superadmin' ? 'default' : 'secondary'}
                        className="profile-badge"
                      >
                        <Shield className="h-4 w-4" />
                        {user.role === 'admin' || user.role === 'superadmin' ? 'Administrador' : user.role}
                      </Badge>
                    </div>
                  )}

                  {/* Bio */}
                  {bio && (
                    <p className="profile-bio max-w-2xl">
                      {bio}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-5xl space-y-12">
            {/* Stats Cards */}
            <div className="profile-stats">
              <div className="stat-card">
                <div className="stat-icon">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div className="stat-value">
                  {joinDate ? joinDate.split(' ')[1] : '2024'}
                </div>
                <div className="stat-label">Miembro desde</div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <div className="stat-value">
                  {user?.role === 'admin' || user?.role === 'superadmin' ? 'Admin' : 'Usuario'}
                </div>
                <div className="stat-label">Rol en la plataforma</div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <div className="stat-value">
                  {user?.email_verified ? 'Verificado' : 'Pendiente'}
                </div>
                <div className="stat-label">Estado de cuenta</div>
              </div>
            </div>

            {/* Details Card */}
            <div className="profile-details">
              <div className="info-card">
                <h2 className="mb-6 text-2xl font-bold">Información de Contacto</h2>
                <div className="space-y-2">
                  {user?.email && (
                    <div className="info-item">
                      <div className="info-icon">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div className="info-content">
                        <div className="info-label">Email</div>
                        <div className="info-value">{user.email}</div>
                      </div>
                    </div>
                  )}

                  {location && (
                    <div className="info-item">
                      <div className="info-icon">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div className="info-content">
                        <div className="info-label">Ubicación</div>
                        <div className="info-value">{location}</div>
                      </div>
                    </div>
                  )}

                  {website && (
                    <div className="info-item">
                      <div className="info-icon">
                        <LinkIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="info-content">
                        <div className="info-label">Sitio Web</div>
                        <a 
                          href={website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="info-value text-primary hover:underline"
                        >
                          {website}
                        </a>
                      </div>
                    </div>
                  )}

                  {joinDate && (
                    <div className="info-item">
                      <div className="info-icon">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div className="info-content">
                        <div className="info-label">Se unió</div>
                        <div className="info-value">{joinDate}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
