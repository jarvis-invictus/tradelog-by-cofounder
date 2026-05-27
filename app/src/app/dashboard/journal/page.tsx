import { createClient } from '@/src/lib/supabase/server'
import { redirect } from 'next/navigation'
import { JournalClient } from '@/src/components/journal/journal-client'

export default async function JournalPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: entries } = await supabase
    .from('journals')
    .select('*, trades(pair, side)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return <JournalClient userId={user.id} initialEntries={entries ?? []} />
}
