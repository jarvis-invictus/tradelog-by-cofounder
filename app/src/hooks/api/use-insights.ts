'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/src/lib/supabase/client'
import type { Tables } from '@/src/lib/supabase/types'

const supabase = createClient()

export function useInsights(userId: string) {
  return useQuery({
    queryKey: ['insights', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('insights')
        .select('*')
        .eq('user_id', userId)
        .order('generated_at', { ascending: false })
      if (error) throw error
      return data as Tables<'insights'>[]
    },
    enabled: !!userId,
  })
}

export function useLatestInsight(userId: string) {
  return useQuery({
    queryKey: ['insights', userId, 'latest'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('insights')
        .select('*')
        .eq('user_id', userId)
        .order('generated_at', { ascending: false })
        .limit(1)
        .single()
      if (error) return null
      return data as Tables<'insights'>
    },
    enabled: !!userId,
  })
}
