'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const DEFAULT_RULES = [
  {
    key: 'max_trades_per_day',
    type: 'max_trades_per_day',
    label: 'Max 3 trades per day',
    description: 'Prevents overtrading in a single session',
    threshold: { limit: 3 },
  },
  {
    key: 'max_daily_loss_inr',
    type: 'max_daily_loss_inr',
    label: 'Stop after ₹2,000 loss',
    description: 'Cuts the day when drawdown hits your limit',
    threshold: { amount: 2000 },
  },
  {
    key: 'min_risk_reward',
    type: 'min_risk_reward',
    label: 'Minimum 1:2 Risk-Reward',
    description: 'Only take trades where potential gain is 2× the risk',
    threshold: { ratio: 2 },
  },
]

export default function RulesSetupPage() {
  const router = useRouter()
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(DEFAULT_RULES.map((r) => [r.key, true]))
  )
  const [loading, setLoading] = useState(false)

  function toggle(key: string) {
    setEnabled((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  async function handleSave() {
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const inserts = DEFAULT_RULES.filter((r) => enabled[r.key]).map((r) => ({
        user_id: user.id,
        type: r.type,
        label: r.label,
        threshold: r.threshold,
        enabled: true,
      }))
      if (inserts.length > 0) {
        await supabase.from('rules').insert(inserts)
      }
    }
    router.push('/onboarding/complete')
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-medium text-foreground text-center">
        Set your discipline rules
      </h1>
      <p className="mt-3 text-center text-sm text-ink-muted leading-relaxed">
        These are your rules. TradeLog will remind you — but never stop you.
      </p>

      <div className="mt-8 space-y-3">
        {DEFAULT_RULES.map((rule) => (
          <div
            key={rule.key}
            className="flex items-center justify-between rounded-xl border border-border bg-surface p-4"
          >
            <div className="flex-1 pr-4">
              <p className="font-medium text-foreground">{rule.label}</p>
              <p className="mt-0.5 text-sm text-ink-muted">{rule.description}</p>
            </div>
            <button
              role="switch"
              aria-checked={enabled[rule.key]}
              onClick={() => toggle(rule.key)}
              className={[
                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-lavender/60',
                enabled[rule.key] ? 'bg-lavender' : 'bg-border',
              ].join(' ')}
            >
              <span
                className={[
                  'inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200',
                  enabled[rule.key] ? 'translate-x-5' : 'translate-x-0',
                ].join(' ')}
              />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSave}
          disabled={loading}
          className="rounded-lg bg-anchor px-8 py-2.5 text-sm font-medium text-paper transition hover:opacity-90 disabled:opacity-60"
        >
          {loading ? 'Saving…' : 'Save & Continue'}
        </button>
      </div>
    </div>
  )
}
