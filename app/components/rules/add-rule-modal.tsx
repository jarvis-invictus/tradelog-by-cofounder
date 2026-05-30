'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AddRuleModalProps {
  isOpen: boolean
  onClose: () => void
}

const RULE_TYPES = [
  { value: 'max_trades_per_day', label: 'Max trades per day' },
  { value: 'max_daily_loss_inr', label: 'Max daily loss (₹)' },
  { value: 'min_risk_reward', label: 'Minimum risk:reward' },
  { value: 'no_trading_after_loss', label: 'No trading after loss (₹)' },
  { value: 'max_lot_size', label: 'Max lot size' },
] as const

type RuleType = typeof RULE_TYPES[number]['value']

export function AddRuleModal({ isOpen, onClose }: AddRuleModalProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [type, setType] = useState<RuleType>('max_trades_per_day')
  const [value, setValue] = useState('')

  const placeholder = useMemo(() => {
    switch (type) {
      case 'max_trades_per_day':
        return 'e.g. 3'
      case 'max_daily_loss_inr':
        return 'e.g. 2000'
      case 'min_risk_reward':
        return 'e.g. 2'
      case 'no_trading_after_loss':
        return 'e.g. 2000'
      case 'max_lot_size':
        return 'e.g. 0.5'
      default:
        return ''
    }
  }, [type])

  const label = useMemo(() => {
    const numValue = Number(value)
    if (!value || isNaN(numValue)) return ''

    switch (type) {
      case 'max_trades_per_day':
        return `Max ${numValue} trades per day`
      case 'max_daily_loss_inr':
        return `Stop after ₹${numValue.toLocaleString()} loss`
      case 'min_risk_reward':
        return `Minimum 1:${numValue} risk-reward`
      case 'no_trading_after_loss':
        return `No trading after ₹${numValue.toLocaleString()} loss`
      case 'max_lot_size':
        return `Max lot size ${numValue}`
      default:
        return ''
    }
  }, [type, value])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!value || isNaN(Number(value))) {
      setError('Please enter a valid number')
      setLoading(false)
      return
    }

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setError('Not authenticated')
      setLoading(false)
      return
    }

    const threshold =
      type === 'min_risk_reward'
        ? { ratio: Number(value) }
        : type === 'max_trades_per_day' || type === 'max_lot_size'
        ? { limit: Number(value) }
        : { amount: Number(value) }

    const { error: insertError } = await supabase.from('rules').insert({
      user_id: user.id,
      type,
      label,
      threshold,
      enabled: true,
    })

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    router.refresh()
    onClose()
    setLoading(false)
    setType('max_trades_per_day')
    setValue('')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-anchor/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal - Right drawer on desktop, bottom sheet on mobile */}
      <div className={cn(
        "absolute bg-surface shadow-xl overflow-y-auto",
        "md:right-0 md:top-0 md:h-full md:max-w-sm md:w-full md:border-l md:border-border",
        "bottom-0 left-0 right-0 h-[85vh] rounded-t-2xl md:rounded-none border-t md:border-t-0 border-border"
      )}>
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="font-display text-lg font-medium text-anchor">
            Add rule
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 hover:bg-neutral transition-colors"
          >
            <X className="h-5 w-5 text-ink-muted" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          {/* Rule Type */}
          <div>
            <label className="block text-sm font-medium text-anchor mb-1.5">
              Rule type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as RuleType)}
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-anchor focus:border-anchor focus:outline-none focus:ring-2 focus:ring-lavender/60"
            >
              {RULE_TYPES.map((rt) => (
                <option key={rt.value} value={rt.value}>
                  {rt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Threshold Value */}
          <div>
            <label className="block text-sm font-medium text-anchor mb-1.5">
              Threshold
            </label>
            <input
              type="number"
              step={type === 'max_lot_size' ? '0.01' : type === 'min_risk_reward' ? '0.1' : '1'}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={placeholder}
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-anchor placeholder:text-ink-muted focus:border-anchor focus:outline-none focus:ring-2 focus:ring-lavender/60"
              required
            />
          </div>

          {/* Preview Label */}
          {label && (
            <div className="rounded-lg bg-paper px-3 py-2">
              <p className="text-xs text-ink-muted mb-1">Label preview</p>
              <p className="text-sm font-medium text-anchor">{label}</p>
            </div>
          )}

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !label}
            className="w-full rounded-lg bg-anchor py-2.5 text-sm font-medium text-paper transition hover:opacity-90 disabled:opacity-60"
          >
            {loading ? 'Adding...' : 'Add rule'}
          </button>
        </form>
      </div>
    </div>
  )
}
