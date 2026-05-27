import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { formatInrPlain, formatShortDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

export default async function TradesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: trades } = await supabase
    .from('trades')
    .select('id, symbol, type, lot_size, open_price, close_price, open_time, close_time, pnl, is_manual, tags')
    .eq('user_id', user.id)
    .order('open_time', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow mb-1">Trades</p>
          <h1 className="font-display text-2xl font-medium text-anchor">Trade history</h1>
        </div>
        <button type="button" className="btn-primary">+ Log trade</button>
      </div>

      <div className="card overflow-hidden">
        {!trades || trades.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <p className="text-sm text-ink-muted">No trades yet.</p>
            <p className="text-xs text-ink-muted">Connect MT5 and your journal fills itself.</p>
          </div>
        ) : (
          <div className="divide-y divide-rule">
            {trades.map((trade) => (
              <div key={trade.id} className="flex items-center justify-between px-4 py-3 hover:bg-neutral/40 transition-colors duration-100">
                <div className="flex items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-medium text-anchor">{trade.symbol}</span>
                      <span className={cn(
                        'rounded-full px-2 py-0.5 font-mono text-[10px] uppercase',
                        trade.type === 'buy' ? 'bg-success-surface text-pnl-up' : 'bg-danger-surface text-pnl-down'
                      )}>
                        {trade.type}
                      </span>
                      {trade.is_manual && (
                        <span className="rounded-full bg-neutral px-2 py-0.5 font-mono text-[10px] uppercase text-ink-muted">manual</span>
                      )}
                    </div>
                    <p className="font-mono text-xs text-ink-muted">
                      {trade.lot_size ? `${trade.lot_size} lot` : '—'} &middot; {trade.open_price?.toFixed(5) ?? '—'}
                      {trade.close_price ? ` → ${trade.close_price.toFixed(5)}` : ' (open)'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn('font-mono text-sm font-semibold', (trade.pnl ?? 0) >= 0 ? 'text-pnl-up' : 'text-pnl-down')}>
                    {(trade.pnl ?? 0) >= 0 ? '+' : '−'}₹{formatInrPlain(Math.abs(trade.pnl ?? 0))}
                  </p>
                  <p className="font-mono text-xs text-ink-muted">{trade.open_time ? formatShortDate(trade.open_time) : '—'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
