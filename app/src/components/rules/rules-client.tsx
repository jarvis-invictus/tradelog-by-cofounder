'use client'

import { useState } from 'react'
import { useRules, useUpdateRule, useDeleteRule } from '@/src/hooks/api/use-rules'
import { StatusCard } from '@/src/components/ui/status-card'
import { formatShortDate } from '@/src/lib/utils'
import { cn } from '@/src/lib/utils'
import type { Tables } from '@/src/lib/supabase/types'

interface RulesClientProps {
  userId: string
  initialRules: Tables<'rules'>[]
  initialViolations: Array<Tables<'rule_violations'> & { rules: { label: string } | null }>
}

const RULE_TYPE_LABELS: Record<string, string> = {
  max_trades_per_day: 'Max trades per day',
  max_daily_loss_inr: 'Max daily loss (\u20B9)',
  min_risk_reward: 'Min risk:reward ratio',
  no_trading_after_loss: 'No trading after consecutive losses',
  max_lot_size: 'Max lot size',
  allowed_pairs: 'Allowed pairs',
  allowed_sessions: 'Allowed sessions',
}

export function RulesClient({ userId, initialRules, initialViolations }: RulesClientProps) {
  const { data: rules = initialRules } = useRules(userId)
  const updateRule = useUpdateRule()
  const deleteRule = useDeleteRule()

  function toggleRule(rule: Tables<'rules'>) {
    updateRule.mutate({ id: rule.id, enabled: !rule.enabled })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow mb-1">Rules</p>
          <h1 className="font-display text-2xl font-medium text-anchor">Your discipline rules</h1>
        </div>
        <button type="button" className="btn-primary">+ Add rule</button>
      </div>

      {rules.length === 0 ? (
        <StatusCard
          variant="info"
          title="No rules set"
          description="Add rules to enforce trading discipline. When broken, you’ll see a friction warning before continuing."
        />
      ) : (
        <div className="card divide-y divide-rule overflow-hidden">
          {rules.map((rule) => (
            <div key={rule.id} className="flex items-center gap-4 px-4 py-3">
              <button
                type="button"
                onClick={() => toggleRule(rule)}
                className={cn(
                  'relative h-5 w-9 rounded-pill transition-colors duration-base flex-shrink-0',
                  rule.enabled ? 'bg-anchor' : 'bg-rule'
                )}
                aria-label={rule.enabled ? 'Disable rule' : 'Enable rule'}
              >
                <span
                  className={cn(
                    'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-base',
                    rule.enabled ? 'translate-x-4' : 'translate-x-0.5'
                  )}
                />
              </button>

              <div className="flex-1">
                <p className="text-sm font-medium text-anchor">{rule.label}</p>
                <p className="text-xs text-ink-muted">{RULE_TYPE_LABELS[rule.type] ?? rule.type}</p>
              </div>

              <button
                type="button"
                onClick={() => deleteRule.mutate({ id: rule.id, userId })}
                className="text-xs text-ink-muted hover:text-danger transition-colors"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {initialViolations.length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-semibold text-anchor">Recent violations</h2>
          <div className="space-y-2">
            {initialViolations.map((v) => (
              <StatusCard
                key={v.id}
                variant={v.overridden ? 'warning' : 'danger'}
                title={v.rules?.label ?? 'Rule violated'}
                description={`${formatShortDate(v.occurred_at)}${v.override_reason ? ` — ${v.override_reason}` : ''}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
