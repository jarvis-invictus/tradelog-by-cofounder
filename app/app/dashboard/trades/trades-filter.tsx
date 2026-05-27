'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'open', label: 'Open' },
  { value: 'closed', label: 'Closed' },
]

interface TradesFilterProps {
  currentFilter: string
}

export function TradesFilter({ currentFilter }: TradesFilterProps) {
  const activeFilter = currentFilter || 'all'

  return (
    <div className="flex gap-1">
      {FILTERS.map((filter) => (
        <Link
          key={filter.value}
          href={`/dashboard/trades?filter=${filter.value}`}
          className={cn(
            'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
            activeFilter === filter.value
              ? 'bg-anchor text-paper'
              : 'bg-white text-ink-muted border border-border hover:border-anchor/30'
          )}
        >
          {filter.label}
        </Link>
      ))}
    </div>
  )
}
