'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/src/lib/supabase/client'
import type { Tables, InsertTables, UpdateTables } from '@/src/lib/supabase/types'

const supabase = createClient()

export function useTrades(userId: string) {
  return useQuery({
    queryKey: ['trades', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trades')
        .select('*')
        .eq('user_id', userId)
        .order('opened_at', { ascending: false })
      if (error) throw error
      return data as Tables<'trades'>[]
    },
    enabled: !!userId,
  })
}

export function useRecentTrades(userId: string, limit = 10) {
  return useQuery({
    queryKey: ['trades', userId, 'recent', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trades')
        .select('*')
        .eq('user_id', userId)
        .order('opened_at', { ascending: false })
        .limit(limit)
      if (error) throw error
      return data as Tables<'trades'>[]
    },
    enabled: !!userId,
  })
}

export function useTradeStats(userId: string) {
  return useQuery({
    queryKey: ['trade-stats', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trades')
        .select('pnl_inr, status, side, opened_at')
        .eq('user_id', userId)
        .eq('status', 'closed')
      if (error) throw error

      const trades = data ?? []
      const totalPnl = trades.reduce((acc, t) => acc + (t.pnl_inr ?? 0), 0)
      const wins = trades.filter((t) => (t.pnl_inr ?? 0) > 0).length
      const losses = trades.filter((t) => (t.pnl_inr ?? 0) < 0).length
      const winRate = trades.length > 0 ? (wins / trades.length) * 100 : 0

      const today = new Date().toISOString().slice(0, 10)
      const todayTrades = trades.filter((t) => t.opened_at.startsWith(today))
      const todayPnl = todayTrades.reduce((acc, t) => acc + (t.pnl_inr ?? 0), 0)

      return {
        totalTrades: trades.length,
        wins,
        losses,
        winRate,
        totalPnl,
        todayPnl,
        todayTradeCount: todayTrades.length,
      }
    },
    enabled: !!userId,
  })
}

export function useCreateTrade() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (trade: InsertTables<'trades'>) => {
      const { data, error } = await supabase.from('trades').insert(trade).select().single()
      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['trades', data.user_id] })
      queryClient.invalidateQueries({ queryKey: ['trade-stats', data.user_id] })
    },
  })
}

export function useUpdateTrade() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...update }: UpdateTables<'trades'> & { id: string }) => {
      const { data, error } = await supabase.from('trades').update(update).eq('id', id).select().single()
      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['trades', data.user_id] })
      queryClient.invalidateQueries({ queryKey: ['trade-stats', data.user_id] })
    },
  })
}
