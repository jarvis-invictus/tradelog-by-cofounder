import { createClient } from '@/src/lib/supabase/server'
import { redirect } from 'next/navigation'
import { RulesClient } from '@/src/components/rules/rules-client'

export default async function RulesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [rulesResult, violationsResult] = await Promise.all([
    supabase.from('rules').select('*').eq('user_id', user.id).order('created_at', { ascending: true }),
    supabase
      .from('rule_violations')
      .select('*, rules(label)')
      .eq('user_id', user.id)
      .order('occurred_at', { ascending: false })
      .limit(10),
  ])

  return (
    <RulesClient
      userId={user.id}
      initialRules={rulesResult.data ?? []}
      initialViolations={violationsResult.data ?? []}
    />
  )
}
