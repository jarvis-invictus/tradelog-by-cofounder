'use client'

import { cn } from '@/src/lib/utils'
import { formatInr, formatLot, formatShortDate } from '@/src/lib/utils'
import { TradeStepper } from '@/src/components/ui/trade-stepper'
import type { Tables } from '@/src/lib/supabase/types'

interface TradeTileProps {
  trade: Tables<'trades'>
}

export function TradeTile({ trade }: TradeTileProps) {
  const pnl = trade.pnl_inr ?? 0
  const isPositive = pnl >= 0

  const step =
    trade.status === 'open'
      ? 'Synced'
      : trade.pnl_inr !== null
      ? 'Rule Check'
      : 'Analyzed'

  return (
    <div className="flex flex-col gap-2 px-4 py-3 hover:bg-neutral/40 transition-colors duration-fast md:flex-row md:items-center md:gap-0">
      <div className="flex flex-1 items-center gap-3">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-medium text-anchor">{trade.pair}</span>
            <span
              className={cn(
                'rounded-pill px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide',
                trade.side === 'buy' ? 'bg-success-surface text-pnl-up' : 'bg-danger-surface text-pnl-down'
              )}
            >
              {trade.side}
            </span>
          </div>
          <span className="font-mono text-xs text-ink-muted">
            {formatLot(trade.lot_size)} &middot; Entry {trade.entry_price.toFixed(5)}
            {trade.exit_price ? ` → ${trade.exit_price.toFixed(5)}` : ' (open)'}
          </span>
        </div>
      </div>

      <div className="hidden md:block">
        <TradeStepper currentStep={step} />
      </div>

      <div className="flex items-center justify-between gap-4 md:ml-auto md:justify-end">
        <div className="text-right">
          <p
            className={cn(
              'font-mono text-sm font-semibold',
              isPositive ? 'text-pnl-up' : 'text-pnl-down'
            )}
          >
            {formatInr(pnl)}
          </p>
          {trade.pnl_pips !== null && (
            <p className={cn('font-mono text-xs', isPositive ? 'text-pnl-up' : 'text-pnl-down')}>
              {trade.pnl_pips > 0 ? '+' : ''}{trade.pnl_pips.toFixed(1)} pips
            </p>
          )}
        </div>
        <p className="font-mono text-xs text-ink-muted">{formatShortDate(trade.opened_at)}</p>
      </div>
    </div>
  )
}
