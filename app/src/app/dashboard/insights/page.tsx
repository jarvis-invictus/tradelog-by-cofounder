import { createClient } from '@/src/lib/supabase/server'
import { redirect } from 'next/navigation'
import { InsightsClient } from '@/src/components/insights/insights-client'

export default async function InsightsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: insights } = await supabase
    .from('insights')
    .select('*')
    .eq('user_id', user.id)
    .order('generated_at', { ascending: false })

  return <InsightsClient userId={user.id} initialInsights={insights ?? []} />
}
