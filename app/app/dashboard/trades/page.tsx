import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { formatInrPlain, formatShortDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { LogTradeButton } from '@/components/trades/log-trade-button'
import { TradesFilter } from './trades-filter'

export default async function TradesPage({
  searchParams,
}: {
  searchParams: { filter?: string }
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: trades } = await supabase
    .from('trades')
    .select('id, symbol, type, lot_size, open_price, close_price, open_time, close_time, pnl, is_manual, tags, status')
    .eq('user_id', user.id)
    .order('open_time', { ascending: false })

  const filter = searchParams.filter || 'all'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow mb-1">Trades</p>
          <h1 className="font-display text-2xl font-medium text-anchor">Trade history</h1>
        </div>
        <LogTradeButton />
      </div>

      <TradesFilter currentFilter={filter} />

      <div className="card overflow-hidden">
        {!trades || trades.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <p className="text-sm text-ink-muted">No trades yet.</p>
            <p className="text-xs text-ink-muted">Log your first trade to start tracking your performance.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-neutral/50 border-b border-rule">
                  <tr>
                    <th className="px-4 py-3 text-left font-mono text-xs uppercase tracking-wider text-ink-muted">Pair</th>
                    <th className="px-4 py-3 text-left font-mono text-xs uppercase tracking-wider text-ink-muted">Side</th>
                    <th className="px-4 py-3 text-left font-mono text-xs uppercase tracking-wider text-ink-muted">Entry</th>
                    <th className="px-4 py-3 text-left font-mono text-xs uppercase tracking-wider text-ink-muted">Exit</th>
                    <th className="px-4 py-3 text-right font-mono text-xs uppercase tracking-wider text-ink-muted">P&L (₹)</th>
                    <th className="px-4 py-3 text-left font-mono text-xs uppercase tracking-wider text-ink-muted">Session</th>
                    <th className="px-4 py-3 text-left font-mono text-xs uppercase tracking-wider text-ink-muted">Date</th>
                    <th className="px-4 py-3 text-left font-mono text-xs uppercase tracking-wider text-ink-muted">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rule">
                  {trades.map((trade) => (
                    <tr key={trade.id} className="hover:bg-neutral/40 transition-colors">
                      <td className="px-4 py-3 font-mono font-medium text-anchor">{trade.symbol}</td>
                      <td className="px-4 py-3">
                        <span className={cn(
                          'rounded-full px-2 py-0.5 font-mono text-[10px] uppercase',
                          trade.type === 'buy' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
                        )}>
                          {trade.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-ink-muted">{trade.open_price?.toFixed(5) ?? '—'}</td>
                      <td className="px-4 py-3 font-mono text-ink-muted">{trade.close_price?.toFixed(5) ?? '—'}</td>
                      <td className={cn(
                        'px-4 py-3 text-right font-mono font-semibold',
                        (trade.pnl ?? 0) >= 0 ? 'text-emerald-600' : 'text-red-500'
                      )}>
                        {(trade.pnl ?? 0) >= 0 ? '+' : ''}₹{Math.abs(trade.pnl ?? 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-ink-muted capitalize">{trade.tags?.[0] ?? '—'}</td>
                      <td className="px-4 py-3 font-mono text-xs text-ink-muted">{trade.open_time ? formatShortDate(trade.open_time) : '—'}</td>
                      <td className="px-4 py-3">
                        <span className={cn(
                          'rounded-full px-2 py-0.5 font-mono text-[10px] uppercase',
                          trade.status === 'open' || !trade.close_price
                            ? 'bg-amber-50 text-amber-600'
                            : 'bg-emerald-50 text-emerald-600'
                        )}>
                          {trade.status === 'open' || !trade.close_price ? 'Open' : 'Closed'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-rule">
              {trades.map((trade) => (
                <div key={trade.id} className="px-4 py-4 hover:bg-neutral/40 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-medium text-anchor">{trade.symbol}</span>
                      <span className={cn(
                        'rounded-full px-2 py-0.5 font-mono text-[10px] uppercase',
                        trade.type === 'buy' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
                      )}>
                        {trade.type}
                      </span>
                    </div>
                    <span className={cn(
                      'rounded-full px-2 py-0.5 font-mono text-[10px] uppercase',
                      trade.status === 'open' || !trade.close_price
                        ? 'bg-amber-50 text-amber-600'
                        : 'bg-emerald-50 text-emerald-600'
                    )}>
                      {trade.status === 'open' || !trade.close_price ? 'Open' : 'Closed'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="font-mono text-ink-muted">
                      {trade.open_price?.toFixed(5) ?? '—'} → {trade.close_price?.toFixed(5) ?? 'Open'}
                    </div>
                    <div className={cn(
                      'font-mono font-semibold',
                      (trade.pnl ?? 0) >= 0 ? 'text-emerald-600' : 'text-red-500'
                    )}>
                      {(trade.pnl ?? 0) >= 0 ? '+' : ''}₹{Math.abs(trade.pnl ?? 0).toFixed(2)}
                    </div>
                  </div>
                  <div className="mt-1 text-xs text-ink-muted">
                    {trade.open_time ? formatShortDate(trade.open_time) : '—'}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
