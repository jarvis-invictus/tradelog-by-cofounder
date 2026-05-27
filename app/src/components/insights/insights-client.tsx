'use client'

import { useInsights } from '@/src/hooks/api/use-insights'
import { StatusCard } from '@/src/components/ui/status-card'
import { formatShortDate } from '@/src/lib/utils'
import type { Tables } from '@/src/lib/supabase/types'

const TYPE_LABELS: Record<string, string> = {
  post_trade: 'Post-trade',
  weekly: 'Weekly',
  behavioral: 'Behavioral edge',
}

interface InsightsClientProps {
  userId: string
  initialInsights: Tables<'insights'>[]
}

export function InsightsClient({ userId, initialInsights }: InsightsClientProps) {
  const { data: insights = initialInsights } = useInsights(userId)

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow mb-1">Insights</p>
        <h1 className="font-display text-2xl font-medium text-anchor">Behavioral insights</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Pattern-first observations generated from your trade history.
        </p>
      </div>

      {insights.length === 0 ? (
        <StatusCard
          variant="info"
          title="No insights yet"
          description="Insights appear after your first closed trades are analyzed."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {insights.map((insight) => (
            <div key={insight.id} className="card p-5">
              <div className="mb-3 flex items-center justify-between">
                <span className="eyebrow">{TYPE_LABELS[insight.type] ?? insight.type}</span>
                <span className="font-mono text-xs text-ink-muted">
                  {formatShortDate(insight.generated_at)}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-anchor">{insight.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
