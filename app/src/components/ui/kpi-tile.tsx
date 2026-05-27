import { cn } from '@/src/lib/utils'

interface KpiTileProps {
  eyebrow: string
  value: string
  delta?: string
  deltaPositive?: boolean
  className?: string
}

export function KpiTile({ eyebrow, value, delta, deltaPositive, className }: KpiTileProps) {
  return (
    <div className={cn('card p-4', className)}>
      <p className="eyebrow mb-2">{eyebrow}</p>
      <p className="font-sans text-2xl font-semibold tabular-nums text-anchor">{value}</p>
      {delta !== undefined && (
        <p
          className={cn(
            'mt-1 font-mono text-xs',
            deltaPositive ? 'text-pnl-up' : 'text-pnl-down'
          )}
        >
          {delta}
        </p>
      )}
    </div>
  )
}
