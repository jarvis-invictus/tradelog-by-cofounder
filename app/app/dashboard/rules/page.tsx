import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { formatShortDate, cn } from '@/lib/utils'
import { RuleToggle } from './rule-toggle'
import { AddRuleButton } from '@/components/rules/add-rule-button'

export default async function RulesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [rulesResult, violationsResult] = await Promise.all([
    supabase.from('rules').select('id, type, label, threshold, enabled').eq('user_id', user.id).order('created_at'),
    supabase
      .from('rule_violations')
      .select('id, occurred_at, override_reason, overridden, rule_id, rules(label)')
      .eq('user_id', user.id)
      .order('occurred_at', { ascending: false })
      .limit(10),
  ])

  const rules = rulesResult.data ?? []
  const violations = violationsResult.data ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow mb-1">Rules</p>
          <h1 className="font-display text-2xl font-medium text-anchor">Discipline rules</h1>
        </div>
        <AddRuleButton />
      </div>

      {rules.length === 0 ? (
        <div className="card p-5">
          <p className="text-sm font-medium text-anchor">No rules set</p>
          <p className="mt-1 text-xs text-ink-muted">
            Add rules to enforce trading discipline. When broken, you&apos;ll see a friction warning before continuing.
          </p>
        </div>
      ) : (
        <div className="card divide-y divide-rule overflow-hidden">
          {rules.map((rule) => (
            <div key={rule.id} className="flex items-center gap-4 px-4 py-3">
              <div className={cn(
                'h-2 w-2 flex-shrink-0 rounded-full',
                rule.enabled ? 'bg-emerald-500' : 'bg-border'
              )} />
              <div className="flex-1">
                <p className="text-sm font-medium text-anchor">{rule.label}</p>
                <p className="text-xs text-ink-muted">{rule.type?.replace(/_/g, ' ')}</p>
              </div>
              <div className="flex items-center gap-3">
                <RuleToggle ruleId={rule.id} enabled={rule.enabled} />
                <span className={cn(
                  'font-mono text-xs',
                  rule.enabled ? 'text-emerald-600' : 'text-ink-muted'
                )}>
                  {rule.enabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {violations.length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-semibold text-anchor">Recent violations</h2>
          <div className="space-y-2">
            {violations.map((v) => (
              <div key={v.id} className="card flex items-start gap-3 p-3 bg-amber-50/50 border-amber-200">
                <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-amber-400" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-anchor">
                      {(v.rules as any)?.label ?? 'Rule violated'}
                    </p>
                    {v.overridden && (
                      <span className="text-xs text-amber-600">Overrode warning</span>
                    )}
                  </div>
                  <p className="text-xs text-ink-muted">
                    {formatShortDate(v.occurred_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
