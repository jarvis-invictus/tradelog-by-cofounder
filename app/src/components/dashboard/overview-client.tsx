'use client'

import { KpiTile } from '@/src/components/ui/kpi-tile'
import { StatusCard } from '@/src/components/ui/status-card'
import { formatInr, formatInrPlain, formatShortDate } from '@/src/lib/utils'
import { cn } from '@/src/lib/utils'

interface OverviewClientProps {
  userId: string
  stats: {
    totalTrades: number
    winRate: number
    totalPnl: number
    todayPnl: number
    todayTradeCount: number
    violationsToday: number
  }
  recentTrades: Array<{
    pair: string
    side: string
    pnl_inr: number | null
    opened_at: string
  }>
  recentInsights: Array<{
    content: string
    type: string
    generated_at: string
  }>
}

export function OverviewClient({ stats, recentTrades, recentInsights }: OverviewClientProps) {
  const kpis = [
    {
      eyebrow: 'Today P&L',
      value: `\u20B9\u200A${formatInrPlain(Math.abs(stats.todayPnl))}`,
      delta: stats.todayPnl >= 0 ? `+\u20B9\u200A${formatInrPlain(stats.todayPnl)}` : `\u2212\u20B9\u200A${formatInrPlain(Math.abs(stats.todayPnl))}`,
      deltaPositive: stats.todayPnl >= 0,
    },
    {
      eyebrow: 'Win Rate',
      value: `${stats.winRate.toFixed(1)}%`,
      delta: `${stats.totalTrades} trades total`,
      deltaPositive: stats.winRate >= 50,
    },
    {
      eyebrow: 'Total P&L',
      value: `\u20B9\u200A${formatInrPlain(Math.abs(stats.totalPnl))}`,
      delta: stats.totalPnl >= 0 ? 'Overall positive' : 'Overall negative',
      deltaPositive: stats.totalPnl >= 0,
    },
    {
      eyebrow: "Today's Trades",
      value: String(stats.todayTradeCount),
      delta: stats.violationsToday > 0 ? `${stats.violationsToday} rule violation${stats.violationsToday > 1 ? 's' : ''}` : 'No violations',
      deltaPositive: stats.violationsToday === 0,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow mb-1">Overview</p>
        <h1 className="font-display text-2xl font-medium text-anchor">Your trading at a glance</h1>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {kpis.map((kpi) => (
          <KpiTile
            key={kpi.eyebrow}
            eyebrow={kpi.eyebrow}
            value={kpi.value}
            delta={kpi.delta}
            deltaPositive={kpi.deltaPositive}
          />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <h2 className="mb-3 text-sm font-semibold text-anchor">Recent trades</h2>
          {recentTrades.length === 0 ? (
            <div className="card flex flex-col items-center justify-center gap-2 py-10 text-center">
              <p className="text-sm text-ink-muted">No trades yet.</p>
              <p className="text-xs text-ink-muted">Connect MT5 and your journal fills itself.</p>
            </div>
          ) : (
            <div className="card divide-y divide-rule overflow-hidden">
              {recentTrades.map((trade, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="font-mono text-sm font-medium text-anchor">{trade.pair}</p>
                    <p className="font-mono text-xs capitalize text-ink-muted">{trade.side} &middot; {formatShortDate(trade.opened_at)}</p>
                  </div>
                  <p
                    className={cn(
                      'font-mono text-sm font-medium',
                      (trade.pnl_inr ?? 0) >= 0 ? 'text-pnl-up' : 'text-pnl-down'
                    )}
                  >
                    {formatInr(trade.pnl_inr ?? 0)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-anchor">Behavioral insights</h2>
          {recentInsights.length === 0 ? (
            <StatusCard
              variant="info"
              title="No insights yet"
              description="Insights appear after your first closed trades."
            />
          ) : (
            recentInsights.map((insight, i) => (
              <div key={i} className="card p-4">
                <p className="eyebrow mb-1.5">{insight.type.replace('_', ' ')}</p>
                <p className="text-sm leading-relaxed text-anchor">{insight.content}</p>
                <p className="mt-2 text-xs text-ink-muted">{formatShortDate(insight.generated_at)}</p>
              </div>
            ))
          )}

          {stats.violationsToday > 0 && (
            <StatusCard
              variant="warning"
              title={`${stats.violationsToday} rule violation${stats.violationsToday > 1 ? 's' : ''} today`}
              description="Review your rules to stay disciplined."
            />
          )}
        </div>
      </div>
    </div>
  )
}
