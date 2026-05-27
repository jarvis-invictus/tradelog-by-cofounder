'use client'

import { useTrades } from '@/src/hooks/api/use-trades'
import { TradeTile } from '@/src/components/trades/trade-tile'
import type { Tables } from '@/src/lib/supabase/types'

interface TradesClientProps {
  userId: string
  initialTrades: Tables<'trades'>[]
}

export function TradesClient({ userId, initialTrades }: TradesClientProps) {
  const { data: trades = initialTrades } = useTrades(userId)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow mb-1">Trades</p>
          <h1 className="font-display text-2xl font-medium text-anchor">Trade history</h1>
        </div>
        <button type="button" className="btn-primary">
          + Log trade
        </button>
      </div>

      <div className="card overflow-hidden">
        {trades.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <p className="text-sm text-ink-muted">No trades yet.</p>
            <p className="text-xs text-ink-muted">Connect MT5 and your journal fills itself.</p>
          </div>
        ) : (
          <div className="divide-y divide-rule">
            {trades.map((trade) => (
              <TradeTile key={trade.id} trade={trade} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
