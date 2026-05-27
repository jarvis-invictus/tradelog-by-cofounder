import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/src/lib/supabase/server'

/**
 * POST /api/sync/mt5
 * Triggers a MetaAPI MT5 trade sync for the authenticated user.
 * Pro plan required.
 * 
 * TODO: wire up MetaAPI SDK once METAAPI_TOKEN is provisioned.
 */
export async function POST(_request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('users')
    .select('plan_tier, mt5_account_id')
    .eq('id', user.id)
    .single()

  if (profile?.plan_tier !== 'pro') {
    return NextResponse.json(
      { error: 'MT5 sync requires Pro plan' },
      { status: 403 }
    )
  }

  if (!profile?.mt5_account_id) {
    return NextResponse.json(
      { error: 'No MT5 account ID configured. Add it in Settings.' },
      { status: 400 }
    )
  }

  // TODO: MetaAPI integration
  // const metaapi = new MetaApi(process.env.METAAPI_TOKEN!)
  // const account = await metaapi.metatraderAccountApi.getAccount(profile.mt5_account_id)
  // const connection = account.getRPCConnection()
  // await connection.connect()
  // const positions = await connection.getPositions()
  // const history = await connection.getHistoryOrdersByTimeRange(from, to)
  // ... upsert into trades table

  return NextResponse.json({
    ok: true,
    message: 'MT5 sync stub — MetaAPI integration pending.',
  })
}
