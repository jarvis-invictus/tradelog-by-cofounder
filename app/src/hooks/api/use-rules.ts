'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/src/lib/supabase/client'
import type { Tables, InsertTables, UpdateTables } from '@/src/lib/supabase/types'

const supabase = createClient()

export function useRules(userId: string) {
  return useQuery({
    queryKey: ['rules', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rules')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true })
      if (error) throw error
      return data as Tables<'rules'>[]
    },
    enabled: !!userId,
  })
}

export function useRuleViolations(userId: string, limit = 20) {
  return useQuery({
    queryKey: ['rule-violations', userId, limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rule_violations')
        .select('*, rules(label, type)')
        .eq('user_id', userId)
        .order('occurred_at', { ascending: false })
        .limit(limit)
      if (error) throw error
      return data
    },
    enabled: !!userId,
  })
}

export function useCreateRule() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (rule: InsertTables<'rules'>) => {
      const { data, error } = await supabase.from('rules').insert(rule).select().single()
      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['rules', data.user_id] })
    },
  })
}

export function useUpdateRule() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...update }: UpdateTables<'rules'> & { id: string }) => {
      const { data, error } = await supabase.from('rules').update(update).eq('id', id).select().single()
      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['rules', data.user_id] })
    },
  })
}

export function useDeleteRule() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, userId }: { id: string; userId: string }) => {
      const { error } = await supabase.from('rules').delete().eq('id', id)
      if (error) throw error
      return { id, userId }
    },
    onSuccess: ({ userId }) => {
      queryClient.invalidateQueries({ queryKey: ['rules', userId] })
    },
  })
}
