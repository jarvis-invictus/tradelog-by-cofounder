'use client'

import { formatShortDate } from '@/src/lib/utils'
import { StatusCard } from '@/src/components/ui/status-card'
import type { Tables } from '@/src/lib/supabase/types'

type JournalEntry = Tables<'journals'> & {
  trades: { pair: string; side: string } | null
}

interface JournalClientProps {
  userId: string
  initialEntries: JournalEntry[]
}

const SENTIMENT_VARIANT = {
  positive: 'success',
  negative: 'danger',
  neutral: 'info',
} as const

export function JournalClient({ userId: _userId, initialEntries }: JournalClientProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow mb-1">Journal</p>
          <h1 className="font-display text-2xl font-medium text-anchor">Trade journal</h1>
        </div>
        <button type="button" className="btn-primary">+ New entry</button>
      </div>

      {initialEntries.length === 0 ? (
        <StatusCard
          variant="info"
          title="No journal entries"
          description="Write your reasoning post-trade. Audio is never stored."
        />
      ) : (
        <div className="space-y-3">
          {initialEntries.map((entry) => (
            <div key={entry.id} className="card p-5">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {entry.trades && (
                    <span className="font-mono text-sm font-medium text-anchor">
                      {entry.trades.pair} &middot; {entry.trades.side}
                    </span>
                  )}
                  {entry.sentiment && (
                    <span className="eyebrow">{entry.sentiment}</span>
                  )}
                </div>
                <span className="font-mono text-xs text-ink-muted">
                  {formatShortDate(entry.created_at)}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-anchor">{entry.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
