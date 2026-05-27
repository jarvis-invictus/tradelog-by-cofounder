import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { formatShortDate } from '@/lib/utils'

export default async function RulesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [rulesResult, violationsResult] = await Promise.all([
    supabase.from('rules').select('id, name, rule_type, is_active, threshold, threshold_unit').eq('user_id', user.id).order('created_at'),
    supabase
      .from('rule_violations')
      .select('id, triggered_at, override_reason, overridden, rules(name)')
      .eq('user_id', user.id)
      .order('triggered_at', { ascending: false })
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
        <button type="button" className="btn-primary">+ Add rule</button>
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
              <div className={`h-2 w-2 flex-shrink-0 rounded-full ${rule.is_active ? 'bg-sage' : 'bg-rule'}`} />
              <div className="flex-1">
                <p className="text-sm font-medium text-anchor">{rule.name}</p>
                <p className="text-xs text-ink-muted">{rule.rule_type.replace(/_/g, ' ')}</p>
              </div>
              <span className={`font-mono text-xs ${rule.is_active ? 'text-pnl-up' : 'text-ink-muted'}`}>
                {rule.is_active ? 'Active' : 'Off'}
              </span>
            </div>
          ))}
        </div>
      )}

      {violations.length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-semibold text-anchor">Recent violations</h2>
          <div className="space-y-2">
            {violations.map((v) => (
              <div key={v.id} className="card flex items-start gap-3 p-3 bg-warning-surface">
                <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-sand" />
                <div>
                  <p className="text-sm font-medium text-anchor">
                    {((v.rules as unknown) as { name: string } | null)?.name ?? 'Rule violated'}
                  </p>
                  <p className="text-xs text-ink-muted">
                    {formatShortDate(v.triggered_at)}
                    {v.override_reason ? ` — ${v.override_reason}` : ''}
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
