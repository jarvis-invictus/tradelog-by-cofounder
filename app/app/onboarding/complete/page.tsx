import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import CompleteClient from './complete-client'

export default async function CompletePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('language, mt5_connected')
    .eq('id', user.id)
    .single()

  const { count: rulesCount } = await supabase
    .from('rules')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)

  return (
    <CompleteClient
      language={profile?.language ?? 'en'}
      mt5Connected={profile?.mt5_connected ?? false}
      rulesCount={rulesCount ?? 0}
    />
  )
}
