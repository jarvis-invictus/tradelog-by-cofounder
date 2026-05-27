'use server'

import { createClient } from '@/lib/supabase/server'
import { generateInsights } from '@/lib/insights/generate-insights'

export async function generateInsightsAction() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await generateInsights(supabase, user.id)
}
