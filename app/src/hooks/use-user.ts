'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/src/lib/supabase/client'

const supabase = createClient()

export function useUser() {
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error || !user) return null
      return user
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function useProfile() {
  const { data: user } = useUser()

  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()
      if (error) return null
      return data
    },
    enabled: !!user?.id,
  })
}
