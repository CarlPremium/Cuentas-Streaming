import type { Metadata } from 'next'
import { generateSEOMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = generateSEOMetadata({
  title: 'Sorteos Activos - Cuentas Streaming',
  description:
    'Participa en sorteos de cuentas premium de streaming. Gana acceso a Netflix, Disney+, HBO Max y más plataformas de streaming. ¡100% Gratis!',
  keywords:
    'sorteos, giveaways, cuentas streaming, sorteos netflix, sorteos disney plus, ganar cuentas premium, sorteos gratis',
  type: 'website',
})

export default function GiveawaysLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
