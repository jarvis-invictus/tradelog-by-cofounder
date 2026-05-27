import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/src/lib/supabase/server'

/**
 * POST /api/insights/generate
 * Generates AI behavioral insights for the authenticated user's recent trades.
 * Uses Claude API (primary) or Groq (fallback).
 * 
 * TODO: wire up Anthropic SDK once ANTHROPIC_API_KEY is provisioned.
 */
export async function POST(_request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: trades } = await supabase
    .from('trades')
    .select('pair, side, lot_size, pnl_inr, pnl_pips, session, opened_at, closed_at')
    .eq('user_id', user.id)
    .eq('status', 'closed')
    .order('opened_at', { ascending: false })
    .limit(50)

  if (!trades || trades.length < 3) {
    return NextResponse.json(
      { error: 'Need at least 3 closed trades to generate insights.' },
      { status: 400 }
    )
  }

  // TODO: Anthropic / Groq integration
  // const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  // const response = await anthropic.messages.create({ ... })
  // await supabase.from('insights').insert({ user_id: user.id, type: 'behavioral', content: response.content[0].text })

  return NextResponse.json({
    ok: true,
    message: 'AI insights stub — Anthropic/Groq integration pending.',
  })
}
