import * as React from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { type User } from '@/types/database'
import { LucideIcon, type LucideIconName } from '@/lib/lucide-icon'
import { getMetaValue } from '@/lib/utils'

interface AsideProps extends React.HTMLAttributes<HTMLDivElement> {
  user: User
}

const Aside = ({ user, ...props }: AsideProps) => {
  const avatarUrl = getMetaValue(user?.meta, 'avatar_url')
  const fullName = getMetaValue(user?.meta, 'full_name')
  const bio = getMetaValue(user?.meta, 'bio')

  return (
    <div {...props}>
      <Avatar className="size-32 lg:size-48">
        <AvatarImage
          src={avatarUrl || undefined}
          alt={`@${user?.username}`}
        />
        <AvatarFallback className="font-serif text-7xl lg:text-9xl">
          {user?.username?.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <div>
        <h1 className="break-all text-4xl font-semibold leading-none tracking-tight">
          {fullName || user?.username}
        </h1>
        <p className="break-all text-sm text-gray-600">@{user?.username}</p>
      </div>
      {user?.email || bio ? (
        <div className="mt-4">
          <ul>
            {user?.email ? (
              <ListItem iconName="Mail">{user?.email}</ListItem>
            ) : null}
          </ul>
          {bio ? <Bio user={user} bio={bio} /> : null}
        </div>
      ) : null}
    </div>
  )
}

interface ListItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  children?: React.ReactNode
  iconName: LucideIconName
}

const ListItem = ({ children, iconName, ...props }: ListItemProps) => {
  return (
    <li className="flex items-center text-sm text-gray-600" {...props}>
      <LucideIcon name={iconName} className="mr-1 size-4 min-w-4" />
      {children}
    </li>
  )
}

interface BioProps extends React.HTMLAttributes<HTMLParagraphElement> {
  user: User
  bio: string
}

const Bio = ({ user, bio, ...props }: BioProps) => {
  return (
    <p className="text-sm text-gray-600" {...props}>
      {bio}
    </p>
  )
}

export { Aside, type AsideProps }
