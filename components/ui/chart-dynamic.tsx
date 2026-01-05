/**
 * Dynamic Chart Component Wrapper
 *
 * Use this instead of importing from '@/components/ui/chart' directly
 * to enable code splitting and reduce initial bundle size.
 *
 * The recharts library is quite large (~200KB), so this wrapper
 * ensures it's only loaded when needed.
 *
 * Note: Due to recharts component structure, only ChartContainer
 * can be dynamically imported. Other components are re-exported.
 *
 * @example
 * ```tsx
 * import { ChartContainer } from '@/components/ui/chart-dynamic'
 * import { BarChart } from 'recharts'
 *
 * export function MyChart() {
 *   return (
 *     <ChartContainer config={chartConfig}>
 *       <BarChart data={data}>
 *         {/* chart content *\/}
 *       </BarChart>
 *     </ChartContainer>
 *   )
 * }
 * ```
 */
'use client'

import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'

const ChartLoadingFallback = () => (
  <div className="flex aspect-video justify-center items-center">
    <Skeleton className="h-full w-full" />
  </div>
)

// Only ChartContainer can be dynamically imported
export const ChartContainer = dynamic(
  () => import('./chart').then((mod) => ({ default: mod.ChartContainer })),
  {
    ssr: false,
    loading: ChartLoadingFallback,
  }
)

// Re-export other components directly (recharts components don't work well with dynamic imports)
export {
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
} from './chart'

// Re-export types
export type { ChartConfig } from './chart'
