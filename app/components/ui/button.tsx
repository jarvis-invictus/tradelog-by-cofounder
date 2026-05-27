import { cn } from '@/lib/utils'
import { type ButtonHTMLAttributes, forwardRef } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
}

const base =
  'inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavender disabled:pointer-events-none disabled:opacity-50 rounded-lg'

const variantClass: Record<Variant, string> = {
  primary:  'bg-anchor text-paper hover:bg-anchor/90 active:scale-[0.99]',
  secondary: 'border border-border-strong bg-paper text-anchor hover:bg-neutral active:scale-[0.99]',
  ghost:    'text-ink-muted hover:bg-neutral hover:text-anchor active:scale-[0.99]',
  danger:   'bg-danger text-white hover:bg-danger/90 active:scale-[0.99]',
}

const sizeClass: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-5 text-sm',
  lg: 'h-12 px-6 text-base',
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  )
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading = false, className, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(base, variantClass[variant], sizeClass[size], className)}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </button>
  )
)

Button.displayName = 'Button'
