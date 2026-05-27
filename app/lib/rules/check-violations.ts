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
    pnl?: number | null
    entryPrice?: number
    stopLoss?: number | null
    takeProfit?: number | null
    side?: string
  }
): Promise<Violation[]> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [rulesRes, todayTradesRes] = await Promise.all([
    supabase.from('rules').select('id, type, label, threshold, enabled').eq('user_id', userId).eq('enabled', true),
    supabase.from('trades').select('pnl, status, open_time').eq('user_id', userId).gte('open_time', today.toISOString()),
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
      const totalLoss = todayTrades.reduce((sum, tr) => sum + (tr.pnl ?? 0), 0)
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
      const { entryPrice, stopLoss, takeProfit, side } = newTrade
      if (entryPrice && stopLoss && takeProfit) {
        const risk = Math.abs(entryPrice - stopLoss)
        const reward = Math.abs(takeProfit - entryPrice)
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
