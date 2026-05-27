import { X } from 'lucide-react'
import { cn } from '@/src/lib/utils'

type ChipVariant = 'default' | 'success' | 'warning' | 'danger' | 'accent'

const variantDot: Record<ChipVariant, string> = {
  default: 'bg-ink-muted',
  success: 'bg-sage',
  warning: 'bg-sand',
  danger: 'bg-danger',
  accent: 'bg-lavender',
}

interface ChipProps {
  label: string
  variant?: ChipVariant
  onRemove?: () => void
  className?: string
}

export function Chip({ label, variant = 'default', onRemove, className }: ChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-pill border border-rule bg-paper px-2.5 py-0.5 font-mono text-xs text-anchor',
        className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full flex-shrink-0', variantDot[variant])} />
      {label}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-0.5 rounded-full text-ink-muted hover:text-anchor transition-colors"
          aria-label={`Remove ${label}`}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  )
}
