import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { formatShortDate } from '@/lib/utils'
import { RegenerateButton } from '@/components/insights/regenerate-button'

const TYPE_LABELS: Record<string, string> = {
  post_trade: 'Post-trade',
  weekly: 'Weekly',
  behavioral: 'Behavioral edge',
}

export default async function InsightsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: insights } = await supabase
    .from('insights')
    .select('*')
    .eq('user_id', user.id)
    .order('generated_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow mb-1">Insights</p>
          <h1 className="font-display text-2xl font-medium text-anchor">Behavioral insights</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Pattern-first observations generated from your trade history.
          </p>
        </div>
        <RegenerateButton />
      </div>

      {!insights || insights.length === 0 ? (
        <div className="card p-5">
          <p className="text-sm font-medium text-anchor">No insights yet</p>
          <p className="mt-1 text-xs text-ink-muted">
            Log at least 3 closed trades to unlock behavioral insights.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {insights.map((ins) => (
            <div key={ins.id} className="card p-5">
              <div className="mb-3 flex items-center justify-between">
                <span className="eyebrow">{TYPE_LABELS[ins.type] ?? ins.type}</span>
                <span className="font-mono text-xs text-ink-muted">
                  {formatShortDate(ins.generated_at)}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-anchor">{ins.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
