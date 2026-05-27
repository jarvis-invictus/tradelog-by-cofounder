'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { X, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { checkViolations, type Violation } from '@/lib/rules/check-violations'
import { generateInsightsAction } from '@/app/actions/generate-insights-action'

interface LogTradeModalProps {
  isOpen: boolean
  onClose: () => void
}

const SESSIONS = [
  { value: 'asian', label: 'Asian' },
  { value: 'london', label: 'London' },
  { value: 'new_york', label: 'New York' },
  { value: 'overlap', label: 'Overlap' },
]

export function LogTradeModal({ isOpen, onClose }: LogTradeModalProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [violations, setViolations] = useState<Violation[]>([])
  const [showWarning, setShowWarning] = useState(false)
  
  const [form, setForm] = useState({
    pair: '',
    side: 'buy' as 'buy' | 'sell',
    lotSize: '',
    entryPrice: '',
    exitPrice: '',
    stopLoss: '',
    takeProfit: '',
    session: '',
    openedAt: new Date().toISOString().slice(0, 16),
    notes: '',
  })

  const pnlPreview = useMemo(() => {
    const entry = parseFloat(form.entryPrice)
    const exit = parseFloat(form.exitPrice)
    const lot = parseFloat(form.lotSize)
    
    if (!entry || !exit || !lot || !form.exitPrice) return null
    
    const pnlPips = form.side === 'buy' ? (exit - entry) * 10000 : (entry - exit) * 10000
    const pnlInr = pnlPips * lot * 0.75
    
    return { pnlPips, pnlInr }
  }, [form.entryPrice, form.exitPrice, form.lotSize, form.side])

  async function saveTrade(overrideViolations?: Violation[]) {
    const supabase = createClient()
    
    const entryPrice = parseFloat(form.entryPrice)
    const exitPrice = form.exitPrice ? parseFloat(form.exitPrice) : null
    const lotSize = parseFloat(form.lotSize)
    
    const pnlPips = exitPrice 
      ? (form.side === 'buy' ? (exitPrice - entryPrice) * 10000 : (entryPrice - exitPrice) * 10000)
      : null
    const pnlInr = pnlPips !== null ? pnlPips * lotSize * 0.75 : null
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setError('Not authenticated')
      setLoading(false)
      return
    }
    
    const { data: trade, error: insertError } = await supabase.from('trades').insert({
      user_id: user.id,
      symbol: form.pair.toUpperCase(),
      type: form.side,
      lot_size: lotSize,
      open_price: entryPrice,
      close_price: exitPrice,
      stop_loss: form.stopLoss ? parseFloat(form.stopLoss) : null,
      take_profit: form.takeProfit ? parseFloat(form.takeProfit) : null,
      session: form.session || null,
      open_time: new Date(form.openedAt).toISOString(),
      close_time: exitPrice ? new Date().toISOString() : null,
      pnl: pnlInr,
      notes: form.notes || null,
      is_manual: true,
      status: exitPrice ? 'closed' : 'open',
    }).select('id').single()
    
    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }
    
    // Record violations if overriding
    if (overrideViolations && overrideViolations.length > 0 && trade) {
      await supabase.from('rule_violations').insert(
        overrideViolations.map(v => ({
          user_id: user.id,
          rule_id: v.rule_id,
          trade_id: trade.id,
          overridden: true,
          override_reason: 'User proceeded despite warning',
          occurred_at: new Date().toISOString(),
        }))
      )
    }
    
    // Trigger insights generation for closed trades
    if (exitPrice) {
      await generateInsightsAction()
    }
    
    router.refresh()
    onClose()
    setLoading(false)
    setShowWarning(false)
    setViolations([])
  }

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
    
    const entryPrice = parseFloat(form.entryPrice)
    
    // Check for violations
    const violationList = await checkViolations(supabase, user.id, {
      entry_price: entryPrice,
      stop_loss: form.stopLoss ? parseFloat(form.stopLoss) : null,
      take_profit: form.takeProfit ? parseFloat(form.takeProfit) : null,
      side: form.side,
    })
    
    if (violationList.length > 0) {
      setViolations(violationList)
      setShowWarning(true)
      setLoading(false)
      return
    }
    
    // No violations, proceed directly
    await saveTrade()
  }
  
  function handleCancelWarning() {
    setShowWarning(false)
    setViolations([])
  }
  
  function handleProceedAnyway() {
    setLoading(true)
    saveTrade(violations)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-anchor/20 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal - Right drawer on desktop, bottom sheet on mobile */}
      <div className={cn(
        "absolute bg-surface shadow-xl overflow-y-auto",
        "md:right-0 md:top-0 md:h-full md:max-w-sm md:w-full md:border-l md:border-border",
        "bottom-0 left-0 right-0 h-[85vh] rounded-t-2xl md:rounded-none border-t md:border-t-0 border-border"
      )}>
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="font-display text-lg font-medium text-anchor">
            {showWarning ? 'Rule Warning' : 'Log Trade'}
          </h2>
          <button 
            onClick={onClose}
            className="rounded-lg p-1.5 hover:bg-neutral transition-colors"
          >
            <X className="h-5 w-5 text-ink-muted" />
          </button>
        </div>
        
        {showWarning ? (
          <div className="p-4 space-y-4">
            {/* Warning Screen */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-amber-800 font-semibold text-sm mb-3">
                <AlertTriangle className="h-4 w-4" />
                You&apos;re about to break {violations.length} rule{violations.length > 1 ? 's' : ''}
              </div>
              <div className="space-y-2">
                {violations.map((v, i) => (
                  <p key={i} className="text-sm text-amber-700">
                    • {v.rule_label}: {v.message}
                  </p>
                ))}
              </div>
            </div>
            
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleCancelWarning}
                disabled={loading}
                className="flex-1 border border-border rounded-lg px-4 py-2 text-sm text-ink-muted hover:bg-neutral transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleProceedAnyway}
                disabled={loading}
                className="flex-1 bg-amber-500 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-amber-600 transition-colors"
              >
                {loading ? 'Saving...' : 'Log Anyway →'}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 p-4">
          {/* Pair */}
          <div>
            <label className="block text-sm font-medium text-anchor mb-1.5">Pair</label>
            <input
              type="text"
              value={form.pair}
              onChange={(e) => setForm({ ...form, pair: e.target.value })}
              placeholder="EURUSD"
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-anchor placeholder:text-ink-muted focus:border-anchor focus:outline-none focus:ring-2 focus:ring-lavender/60"
              required
            />
          </div>
          
          {/* Side Toggle */}
          <div>
            <label className="block text-sm font-medium text-anchor mb-1.5">Side</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setForm({ ...form, side: 'buy' })}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all",
                  form.side === 'buy'
                    ? "bg-emerald-50 text-emerald-700 border-2 border-emerald-200"
                    : "bg-white border border-border text-ink-muted hover:border-emerald-200"
                )}
              >
                <TrendingUp className="h-4 w-4" />
                Buy
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, side: 'sell' })}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all",
                  form.side === 'sell'
                    ? "bg-red-50 text-red-700 border-2 border-red-200"
                    : "bg-white border border-border text-ink-muted hover:border-red-200"
                )}
              >
                <TrendingDown className="h-4 w-4" />
                Sell
              </button>
            </div>
          </div>
          
          {/* Lot Size & Entry Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-anchor mb-1.5">Lot Size</label>
              <input
                type="number"
                step="0.01"
                value={form.lotSize}
                onChange={(e) => setForm({ ...form, lotSize: e.target.value })}
                placeholder="0.10"
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-anchor placeholder:text-ink-muted focus:border-anchor focus:outline-none focus:ring-2 focus:ring-lavender/60"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-anchor mb-1.5">Entry Price</label>
              <input
                type="number"
                step="0.00001"
                value={form.entryPrice}
                onChange={(e) => setForm({ ...form, entryPrice: e.target.value })}
                placeholder="1.08500"
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-anchor placeholder:text-ink-muted focus:border-anchor focus:outline-none focus:ring-2 focus:ring-lavender/60"
                required
              />
            </div>
          </div>
          
          {/* Exit Price */}
          <div>
            <label className="block text-sm font-medium text-anchor mb-1.5">
              Exit Price <span className="text-ink-muted font-normal">(optional)</span>
            </label>
            <input
              type="number"
              step="0.00001"
              value={form.exitPrice}
              onChange={(e) => setForm({ ...form, exitPrice: e.target.value })}
              placeholder="Leave blank for open trade"
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-anchor placeholder:text-ink-muted focus:border-anchor focus:outline-none focus:ring-2 focus:ring-lavender/60"
            />
            
            {/* P&L Preview */}
            {pnlPreview && (
              <div className={cn(
                "mt-2 flex items-center justify-between rounded-lg px-3 py-2 text-sm",
                pnlPreview.pnlInr >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
              )}>
                <span className="font-medium">P&L Preview</span>
                <span className="font-mono">
                  {pnlPreview.pnlInr >= 0 ? '+' : ''}₹{Math.abs(pnlPreview.pnlInr).toFixed(2)}
                  {' · '}
                  {pnlPreview.pnlPips >= 0 ? '+' : ''}{pnlPreview.pnlPips.toFixed(1)} pips
                </span>
              </div>
            )}
          </div>
          
          {/* Stop Loss & Take Profit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-anchor mb-1.5">
                Stop Loss <span className="text-ink-muted font-normal">(opt)</span>
              </label>
              <input
                type="number"
                step="0.00001"
                value={form.stopLoss}
                onChange={(e) => setForm({ ...form, stopLoss: e.target.value })}
                placeholder="1.08000"
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-anchor placeholder:text-ink-muted focus:border-anchor focus:outline-none focus:ring-2 focus:ring-lavender/60"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-anchor mb-1.5">
                Take Profit <span className="text-ink-muted font-normal">(opt)</span>
              </label>
              <input
                type="number"
                step="0.00001"
                value={form.takeProfit}
                onChange={(e) => setForm({ ...form, takeProfit: e.target.value })}
                placeholder="1.09000"
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-anchor placeholder:text-ink-muted focus:border-anchor focus:outline-none focus:ring-2 focus:ring-lavender/60"
              />
            </div>
          </div>
          
          {/* Session */}
          <div>
            <label className="block text-sm font-medium text-anchor mb-1.5">
              Session <span className="text-ink-muted font-normal">(optional)</span>
            </label>
            <select
              value={form.session}
              onChange={(e) => setForm({ ...form, session: e.target.value })}
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-anchor focus:border-anchor focus:outline-none focus:ring-2 focus:ring-lavender/60"
            >
              <option value="">Select session</option>
              {SESSIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          
          {/* Opened At */}
          <div>
            <label className="block text-sm font-medium text-anchor mb-1.5">Opened At</label>
            <input
              type="datetime-local"
              value={form.openedAt}
              onChange={(e) => setForm({ ...form, openedAt: e.target.value })}
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-anchor focus:border-anchor focus:outline-none focus:ring-2 focus:ring-lavender/60"
              required
            />
          </div>
          
          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-anchor mb-1.5">
              Notes <span className="text-ink-muted font-normal">(optional)</span>
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Trade setup, emotions, lessons..."
              rows={3}
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-anchor placeholder:text-ink-muted focus:border-anchor focus:outline-none focus:ring-2 focus:ring-lavender/60 resize-none"
            />
          </div>
          
          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-anchor py-2.5 text-sm font-medium text-paper transition hover:opacity-90 disabled:opacity-60"
          >
            {loading ? 'Saving...' : 'Log Trade'}
          </button>
        </form>
        )}
      </div>
    </div>
  )
}
