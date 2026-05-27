import { cn } from '@/src/lib/utils'

type Variant = 'success' | 'warning' | 'danger' | 'info'

const variantStyles: Record<Variant, { dot: string; bg: string; text: string }> = {
  success: { dot: 'bg-sage', bg: 'bg-success-surface', text: 'text-anchor' },
  warning: { dot: 'bg-sand', bg: 'bg-warning-surface', text: 'text-anchor' },
  danger: { dot: 'bg-danger', bg: 'bg-danger-surface', text: 'text-anchor' },
  info: { dot: 'bg-lavender', bg: 'bg-lavender/20', text: 'text-anchor' },
}

interface StatusCardProps {
  variant: Variant
  title: string
  description?: string
  className?: string
}

export function StatusCard({ variant, title, description, className }: StatusCardProps) {
  const styles = variantStyles[variant]

  return (
    <div className={cn('flex items-start gap-3 rounded-card border border-rule p-3', styles.bg, className)}>
      <span className={cn('mt-1.5 h-2 w-2 flex-shrink-0 rounded-full', styles.dot)} />
      <div>
        <p className={cn('text-sm font-medium', styles.text)}>{title}</p>
        {description && (
          <p className="mt-0.5 text-xs text-ink-muted">{description}</p>
        )}
      </div>
    </div>
  )
}
