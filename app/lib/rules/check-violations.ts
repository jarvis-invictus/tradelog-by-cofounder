import { SupabaseClient } from '@supabase/supabase-js'

export type Violation = {
  rule_id: string
  rule_label: string
  rule_type: string
  message: string
}

export async function checkViolations(
  supabase: SupabaseClient,
  userId: string,
  newTrade: {
    pnl_inr?: number | null
    entry_price?: number
    stop_loss?: number | null
    take_profit?: number | null
    side?: string
  }
): Promise<Violation[]> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [rulesRes, todayTradesRes] = await Promise.all([
    supabase.from('rules').select('id, type, label, threshold, enabled').eq('user_id', userId).eq('enabled', true),
    supabase.from('trades').select('pnl_inr, status, opened_at').eq('user_id', userId).gte('opened_at', today.toISOString()),
  ])

  const rules = rulesRes.data ?? []
  const todayTrades = todayTradesRes.data ?? []
  const violations: Violation[] = []

  for (const rule of rules) {
    const t = rule.threshold as Record<string, number>

    if (rule.type === 'max_trades_per_day') {
      if (todayTrades.length >= t.limit) {
        violations.push({
          rule_id: rule.id,
          rule_label: rule.label,
          rule_type: rule.type,
          message: `You've already logged ${todayTrades.length} trades today. Your limit is ${t.limit}.`,
        })
      }
    }

    if (rule.type === 'max_daily_loss_inr') {
      const totalLoss = todayTrades.reduce((sum, tr) => sum + (tr.pnl_inr ?? 0), 0)
      if (totalLoss <= -t.amount) {
        violations.push({
          rule_id: rule.id,
          rule_label: rule.label,
          rule_type: rule.type,
          message: `You've hit your daily loss limit of ₹${t.amount.toLocaleString('en-IN')}. Today's P&L: ₹${totalLoss.toLocaleString('en-IN')}.`,
        })
      }
    }

    if (rule.type === 'min_risk_reward') {
      const { entry_price, stop_loss, take_profit, side } = newTrade
      if (entry_price && stop_loss && take_profit) {
        const risk = Math.abs(entry_price - stop_loss)
        const reward = Math.abs(take_profit - entry_price)
        const rr = risk > 0 ? reward / risk : 0
        if (rr < t.ratio) {
          violations.push({
            rule_id: rule.id,
            rule_label: rule.label,
            rule_type: rule.type,
            message: `This trade's R:R is 1:${rr.toFixed(1)}, below your minimum of 1:${t.ratio}.`,
          })
        }
      }
    }
  }

  return violations
}
