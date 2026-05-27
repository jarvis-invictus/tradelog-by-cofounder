import { SupabaseClient } from '@supabase/supabase-js'

export async function generateInsights(supabase: SupabaseClient, userId: string) {
  const { data: trades } = await supabase
    .from('trades')
    .select('pnl_inr, side, session, opened_at, status, entry_price, stop_loss, take_profit')
    .eq('user_id', userId)
    .eq('status', 'closed')

  if (!trades || trades.length < 3) return // need at least 3 closed trades

  const insights: { type: string; content: string; patterns: object }[] = []

  // 1. Win rate by session
  const sessions = ['asian','london','new_york','overlap']
  for (const session of sessions) {
    const sessionTrades = trades.filter(t => t.session === session)
    if (sessionTrades.length >= 2) {
      const wins = sessionTrades.filter(t => (t.pnl_inr ?? 0) > 0).length
      const rate = Math.round((wins / sessionTrades.length) * 100)
      if (rate >= 65) {
        insights.push({
          type: 'behavioral',
          content: `You win ${rate}% of your ${session.replace('_',' ')} session trades (${sessionTrades.length} trades). This is your strongest session.`,
          patterns: { session, win_rate: rate, sample: sessionTrades.length }
        })
      } else if (rate <= 35) {
        insights.push({
          type: 'behavioral',
          content: `You only win ${rate}% of your ${session.replace('_',' ')} session trades. Consider avoiding this session or reviewing your approach.`,
          patterns: { session, win_rate: rate, sample: sessionTrades.length }
        })
      }
    }
  }

  // 2. Avg win vs avg loss
  const wins = trades.filter(t => (t.pnl_inr ?? 0) > 0)
  const losses = trades.filter(t => (t.pnl_inr ?? 0) < 0)
  if (wins.length >= 2 && losses.length >= 2) {
    const avgWin = wins.reduce((s,t) => s + (t.pnl_inr ?? 0), 0) / wins.length
    const avgLoss = Math.abs(losses.reduce((s,t) => s + (t.pnl_inr ?? 0), 0) / losses.length)
    const ratio = avgWin / avgLoss
    if (ratio < 0.8) {
      insights.push({
        type: 'behavioral',
        content: `Your average win (₹${Math.round(avgWin).toLocaleString('en-IN')}) is smaller than your average loss (₹${Math.round(avgLoss).toLocaleString('en-IN')}). You need a win rate above ${Math.round((avgLoss/(avgWin+avgLoss))*100)}% just to break even.`,
        patterns: { avg_win: avgWin, avg_loss: avgLoss, ratio }
      })
    } else if (ratio > 1.5) {
      insights.push({
        type: 'behavioral',
        content: `Strong edge: your average win (₹${Math.round(avgWin).toLocaleString('en-IN')}) is ${ratio.toFixed(1)}x your average loss. Keep protecting this ratio.`,
        patterns: { avg_win: avgWin, avg_loss: avgLoss, ratio }
      })
    }
  }

  // 3. Buy vs sell win rate
  for (const side of ['buy','sell'] as const) {
    const sideTrades = trades.filter(t => t.side === side)
    if (sideTrades.length >= 3) {
      const sideWins = sideTrades.filter(t => (t.pnl_inr ?? 0) > 0).length
      const rate = Math.round((sideWins / sideTrades.length) * 100)
      if (rate >= 70) {
        insights.push({
          type: 'behavioral',
          content: `You win ${rate}% of your ${side} trades. You have a clear directional edge — ${side === 'buy' ? 'long' : 'short'} setups suit your style.`,
          patterns: { side, win_rate: rate, sample: sideTrades.length }
        })
      }
    }
  }

  // Upsert insights (delete old behavioral ones, insert fresh)
  await supabase.from('insights').delete().eq('user_id', userId).eq('type', 'behavioral')
  if (insights.length > 0) {
    await supabase.from('insights').insert(
      insights.map(i => ({
        user_id: userId,
        type: i.type,
        content: i.content,
        patterns: i.patterns,
        generated_at: new Date().toISOString(),
      }))
    )
  }
}
