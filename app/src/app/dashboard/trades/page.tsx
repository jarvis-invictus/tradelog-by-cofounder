import { createClient } from '@/src/lib/supabase/server'
import { redirect } from 'next/navigation'
import { TradesClient } from '@/src/components/trades/trades-client'

export default async function TradesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: trades } = await supabase
    .from('trades')
    .select('*')
    .eq('user_id', user.id)
    .order('opened_at', { ascending: false })

  return <TradesClient userId={user.id} initialTrades={trades ?? []} />
}
