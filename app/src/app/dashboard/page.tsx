import { createClient } from '@/src/lib/supabase/server'
import { redirect } from 'next/navigation'
import { OverviewClient } from '@/src/components/dashboard/overview-client'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const today = new Date().toISOString().slice(0, 10)

  const [tradesResult, violationsResult, insightResult] = await Promise.all([
    supabase
      .from('trades')
      .select('pnl_inr, status, side, opened_at, pair')
      .eq('user_id', user.id)
      .eq('status', 'closed')
      .order('opened_at', { ascending: false })
      .limit(50),
    supabase
      .from('rule_violations')
      .select('id, overridden, occurred_at')
      .eq('user_id', user.id)
      .gte('occurred_at', `${today}T00:00:00`),
    supabase
      .from('insights')
      .select('content, type, generated_at')
      .eq('user_id', user.id)
      .order('generated_at', { ascending: false })
      .limit(3),
  ])

  const trades = tradesResult.data ?? []
  const violations = violationsResult.data ?? []
  const insights = insightResult.data ?? []

  const totalPnl = trades.reduce((acc, t) => acc + (t.pnl_inr ?? 0), 0)
  const wins = trades.filter((t) => (t.pnl_inr ?? 0) > 0).length
  const winRate = trades.length > 0 ? (wins / trades.length) * 100 : 0
  const todayTrades = trades.filter((t) => t.opened_at.startsWith(today))
  const todayPnl = todayTrades.reduce((acc, t) => acc + (t.pnl_inr ?? 0), 0)

  return (
    <OverviewClient
      userId={user.id}
      stats={{
        totalTrades: trades.length,
        winRate,
        totalPnl,
        todayPnl,
        todayTradeCount: todayTrades.length,
        violationsToday: violations.length,
      }}
      recentTrades={trades.slice(0, 8)}
      recentInsights={insights}
    />
  )
}
