import * as React from 'react'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'

import { absoluteUrl, cn, getMetaValue } from '@/lib/utils'
import { type Tag } from '@/lib/emblor'
import { type PostMeta } from '@/types/database'

interface EntryTagsProps extends React.HTMLAttributes<HTMLDivElement> {
  pathname?: string
  meta?: PostMeta[]
}

const EntryTags = ({ className, meta, pathname, ...props }: EntryTagsProps) => {
  const tags: Tag[] = JSON.parse(getMetaValue(meta, 'tags', '[]'))

  if (Array.isArray(tags) && tags?.length === 0) {
    return null
  }

  return (
    <div className={cn('flex w-full flex-wrap gap-1.5', className)} {...props}>
      {tags?.slice(0, 3).map((tag: Tag) => (
        <Link
          key={tag?.id}
          href={
            pathname && tag?.slug
              ? absoluteUrl(`${pathname}?tag=${tag?.slug}`)
              : '#'
          }
          className={cn(
            'inline-flex items-center rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium',
            'text-primary transition-all duration-200',
            'hover:bg-primary hover:text-primary-foreground hover:shadow-sm'
          )}
        >
          {tag?.text}
        </Link>
      ))}
      {tags?.length > 3 && (
        <span className="inline-flex items-center rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
          +{tags.length - 3}
        </span>
      )}
    </div>
  )
}

export { EntryTags, type EntryTagsProps }
