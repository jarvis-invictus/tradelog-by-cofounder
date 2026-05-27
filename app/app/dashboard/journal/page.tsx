import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { formatShortDate, cn } from '@/lib/utils'
import { JournalEntryButton } from '@/components/journal/journal-entry-button'

export default async function JournalPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: journals } = await supabase
    .from('journals')
    .select('id, content, sentiment, created_at, trade_id, trades(symbol, type, opened_at)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow mb-1">Journal</p>
          <h1 className="font-display text-3xl font-medium text-anchor">Journal</h1>
        </div>
        <JournalEntryButton />
      </div>

      {!journals || journals.length === 0 ? (
        <div className="card p-5">
          <p className="text-sm font-medium text-anchor">No journal entries yet.</p>
          <p className="mt-1 text-xs text-ink-muted">
            Reflect on your trades to build self-awareness.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {journals.map((entry) => (
            <div key={entry.id} className="card p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {entry.trade_id && entry.trades && (
                    <span className="font-mono text-xs bg-anchor/10 text-anchor rounded-full px-2 py-0.5">
                      {(entry.trades as any).symbol} · {(entry.trades as any).type} · {formatShortDate((entry.trades as any).opened_at)}
                    </span>
                  )}
                  {!entry.trade_id && (
                    <span className="font-mono text-xs bg-neutral text-ink-muted rounded-full px-2 py-0.5">
                      Standalone entry
                    </span>
                  )}
                </div>
                <div className={cn(
                  'h-2.5 w-2.5 rounded-full',
                  entry.sentiment === 'positive' && 'bg-emerald-500',
                  entry.sentiment === 'negative' && 'bg-red-400',
                  entry.sentiment === 'neutral' && 'bg-border'
                )} />
              </div>
              <p className="text-sm text-anchor leading-relaxed mb-2">{entry.content}</p>
              <p className="text-xs text-ink-muted">{formatShortDate(entry.created_at)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
