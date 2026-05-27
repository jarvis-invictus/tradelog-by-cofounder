import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Plug, AlertTriangle } from 'lucide-react'
import { LogTradeButton } from '@/components/trades/log-trade-button'
import { cn } from '@/lib/utils'
import { formatShortDate } from '@/lib/utils'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  const [profileResult, tradesResult, recentTradesResult, violationsResult] = await Promise.all([
    supabase.from('users').select('full_name').eq('id', user.id).single(),
    supabase.from('trades').select('pnl, status, close_price').eq('user_id', user.id),
    supabase.from('trades')
      .select('id, symbol, type, open_price, close_price, pnl, open_time, status')
      .eq('user_id', user.id)
      .order('open_time', { ascending: false })
      .limit(5),
    supabase.from('rule_violations')
      .select('id, occurred_at, rules(label)')
      .eq('user_id', user.id)
      .gte('occurred_at', todayStart.toISOString())
      .order('occurred_at', { ascending: false }),
  ])

  const firstName = profileResult.data?.full_name?.split(' ')[0] ?? 'there'
  const trades = tradesResult.data ?? []
  const closedTrades = trades.filter(t => t.status === 'closed' || t.close_price != null)
  const tradeCount = trades.length
  const hasTrades = tradeCount > 0

  // Calculate win rate and net P&L
  const winningTrades = closedTrades.filter(t => (t.pnl ?? 0) > 0)
  const winRate = closedTrades.length > 0 ? Math.round((winningTrades.length / closedTrades.length) * 100) : 0
  const netPnl = closedTrades.reduce((sum, t) => sum + (t.pnl ?? 0), 0)

  const recentTrades = recentTradesResult.data ?? []
  const todayViolations = violationsResult.data ?? []

  const stats = [
    { label: 'Total Trades', display: String(tradeCount), color: 'text-anchor' },
    { label: 'Win Rate', display: `${winRate}%`, color: 'text-anchor' },
    { label: 'Net P\u0026L (\u20B9)', display: `₹${netPnl.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, color: netPnl > 0 ? 'text-emerald-600' : netPnl < 0 ? 'text-red-500' : 'text-anchor' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-ink-muted">Overview</p>
        <h1 className="mt-1 font-display text-3xl font-medium text-anchor">
          Welcome back, {firstName}
        </h1>
      </div>

      {todayViolations.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-1">
          <div className="flex items-center gap-2 text-amber-800 font-semibold text-sm">
            <AlertTriangle className="h-4 w-4" />
            {todayViolations.length} rule{todayViolations.length > 1 ? 's' : ''} broken today
          </div>
          <div className="space-y-1">
            {todayViolations.map((v) => (
              <p key={v.id} className="text-xs text-amber-700 ml-6">
                • {(v.rules as any)?.label ?? 'Unknown rule'} at {new Date(v.occurred_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false })}
              </p>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map(({ label, display, color }) => (
          <div key={label} className="bg-surface border border-border rounded-lg p-6 shadow-sm">
            <p className="font-mono text-xs uppercase tracking-widest text-ink-muted">{label}</p>
            <p className={cn("mt-2 font-display text-3xl font-medium tabular-nums", color)}>
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
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-anchor">Recent trades</h2>
          <LogTradeButton />
        </div>
        
        {recentTrades.length === 0 ? (
          <div className="bg-surface border border-border rounded-lg shadow-sm flex flex-col items-center justify-center gap-3 py-16 text-center px-6">
            <p className="text-sm font-medium text-anchor">Log your first trade to start tracking your performance.</p>
            <LogTradeButton />
          </div>
        ) : (
          <div className="bg-surface border border-border rounded-lg shadow-sm divide-y divide-rule">
            {recentTrades.map((trade) => (
              <div key={trade.id} className="flex items-center justify-between px-4 py-3 hover:bg-neutral/40 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-medium text-anchor">{trade.symbol}</span>
                  <span className={cn(
                    'rounded-full px-2 py-0.5 font-mono text-[10px] uppercase',
                    trade.type === 'buy' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
                  )}>
                    {trade.type}
                  </span>
                </div>
                <div className="text-right">
                  <p className={cn(
                    'font-mono text-sm font-semibold',
                    (trade.pnl ?? 0) >= 0 ? 'text-emerald-600' : 'text-red-500'
                  )}>
                    {(trade.pnl ?? 0) >= 0 ? '+' : ''}₹{Math.abs(trade.pnl ?? 0).toFixed(2)}
                  </p>
                  <p className="text-xs text-ink-muted">{trade.open_time ? formatShortDate(trade.open_time) : '—'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
