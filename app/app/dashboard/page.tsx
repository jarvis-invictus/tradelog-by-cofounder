import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Plug } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [profileResult, countResult] = await Promise.all([
    supabase.from('profiles').select('full_name').eq('id', user.id).single(),
    supabase.from('trades').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
  ])

  const firstName = profileResult.data?.full_name?.split(' ')[0] ?? 'there'
  const tradeCount = countResult.count ?? 0
  const hasTrades = tradeCount > 0

  const stats = [
    { label: 'Total Trades', display: String(tradeCount) },
    { label: 'Win Rate',     display: '0%' },
    { label: 'Net P\u0026L (\u20B9)', display: '\u20B9\u20090.00' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-ink-muted">Overview</p>
        <h1 className="mt-1 font-display text-3xl font-medium text-anchor">
          Welcome back, {firstName}
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map(({ label, display }) => (
          <div key={label} className="bg-surface border border-border rounded-lg p-6 shadow-sm">
            <p className="font-mono text-xs uppercase tracking-widest text-ink-muted">{label}</p>
            <p className="mt-2 font-display text-3xl font-medium tabular-nums text-anchor">
              {display}
            </p>
          </div>
        ))}
      </div>

      {!hasTrades && (
        <div className="bg-surface border border-border rounded-lg p-6 shadow-sm flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-anchor/10">
              <Plug className="h-5 w-5 text-anchor" />
            </div>
            <div>
              <p className="font-medium text-anchor">Connect MT5 Account</p>
              <p className="mt-0.5 text-sm text-ink-muted">
                Link your MetaTrader 5 account to start auto-syncing your trades.
              </p>
              <p className="mt-1 font-mono text-xs text-ink-muted">
                Project ref: <span className="text-anchor">micjlaxtmjyrjqmsjskt</span>
              </p>
            </div>
          </div>
          <a
            href="https://app.supabase.com/project/micjlaxtmjyrjqmsjskt"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 flex-shrink-0 items-center justify-center gap-2 rounded-lg bg-anchor px-5 text-sm font-medium text-paper transition-all hover:bg-anchor/90 active:scale-[0.99]"
          >
            Open Supabase
          </a>
        </div>
      )}

      <div>
        <h2 className="mb-3 text-sm font-semibold text-anchor">Recent trades</h2>
        <div className="bg-surface border border-border rounded-lg shadow-sm flex flex-col items-center justify-center gap-2 py-16 text-center px-6">
          <p className="text-sm font-medium text-anchor">No trades yet</p>
          <p className="text-sm text-ink-muted">
            Your trades will appear here once you connect MT5.
          </p>
        </div>
      </div>
    </div>
  )
}
