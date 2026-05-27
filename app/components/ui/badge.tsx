import { cn } from '@/lib/utils'
import { type HTMLAttributes } from 'react'

type BadgeVariant = 'success' | 'warning' | 'danger' | 'neutral'

const variantClass: Record<BadgeVariant, string> = {
  success: 'bg-success-surface text-success',
  warning: 'bg-warning-surface text-warning',
  danger:  'bg-danger-surface text-danger',
  neutral: 'bg-surface-muted text-ink-muted',
}

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

export function Badge({ variant = 'neutral', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wide',
        variantClass[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
