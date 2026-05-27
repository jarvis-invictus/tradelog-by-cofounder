'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { X } from 'lucide-react'
import { cn, formatShortDate } from '@/lib/utils'

interface JournalEntryModalProps {
  isOpen: boolean
  onClose: () => void
}

const SENTIMENTS = [
  { value: 'positive', label: '😊 Positive', color: 'bg-emerald-500' },
  { value: 'neutral', label: '😐 Neutral', color: 'bg-border' },
  { value: 'negative', label: '😔 Negative', color: 'bg-red-400' },
]

type Trade = {
  id: string
  symbol: string
  type: string
  opened_at: string
}

export function JournalEntryModal({ isOpen, onClose }: JournalEntryModalProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [trades, setTrades] = useState<Trade[]>([])
  
  const [form, setForm] = useState({
    trade_id: '',
    content: '',
    sentiment: 'neutral' as 'positive' | 'neutral' | 'negative',
  })

  // Fetch last 20 trades on open
  useEffect(() => {
    if (isOpen) {
      const supabase = createClient()
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          supabase
            .from('trades')
            .select('id, symbol, type, opened_at')
            .eq('user_id', user.id)
            .order('opened_at', { ascending: false })
            .limit(20)
            .then(({ data }) => setTrades(data ?? []))
        }
      })
    }
  }, [isOpen])

  if (!isOpen) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      setError('Not authenticated')
      setLoading(false)
      return
    }

    const { error: insertError } = await supabase.from('journals').insert({
      user_id: user.id,
      trade_id: form.trade_id || null,
      content: form.content,
      sentiment: form.sentiment,
    })

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    router.refresh()
    onClose()
    setLoading(false)
    setForm({ trade_id: '', content: '', sentiment: 'neutral' })
  }

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      
      <div className={cn(
        "absolute bg-surface shadow-xl overflow-y-auto",
        "md:right-0 md:top-0 md:h-full md:max-w-sm md:w-full md:border-l md:border-border",
        "bottom-0 left-0 right-0 h-[85vh] rounded-t-2xl md:rounded-none border-t md:border-t-0 border-border"
      )}>
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="font-display text-lg font-medium text-anchor">New Journal Entry</h2>
          <button 
            onClick={onClose}
            className="rounded-lg p-1.5 hover:bg-neutral transition-colors"
          >
            <X className="h-5 w-5 text-ink-muted" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          {/* Trade Select */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wide text-ink-muted">
              Trade (optional)
            </label>
            <select
              value={form.trade_id}
              onChange={(e) => setForm({ ...form, trade_id: e.target.value })}
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-anchor focus:border-anchor focus:outline-none"
            >
              <option value="">Standalone (no trade)</option>
              {trades.map((trade) => (
                <option key={trade.id} value={trade.id}>
                  {trade.symbol} {trade.type} {formatShortDate(trade.opened_at)}
                </option>
              ))}
            </select>
          </div>

          {/* Sentiment */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wide text-ink-muted">
              Sentiment
            </label>
            <div className="flex gap-2">
              {SENTIMENTS.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setForm({ ...form, sentiment: s.value as any })}
                  className={cn(
                    'flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all',
                    form.sentiment === s.value
                      ? 'bg-anchor text-paper'
                      : 'border border-border text-ink-muted hover:border-anchor/30'
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wide text-ink-muted">
              Entry
            </label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="What happened in this trade? What did you do well? What would you do differently?"
              rows={6}
              required
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-anchor placeholder:text-ink-faint focus:border-anchor focus:outline-none resize-none"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !form.content.trim()}
            className="w-full rounded-lg bg-anchor py-2.5 text-sm font-medium text-paper transition hover:opacity-90 disabled:opacity-60"
          >
            {loading ? 'Saving...' : 'Save Entry'}
          </button>
        </form>
      </div>
    </div>
  )
}
