'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function Mt5ConnectPage() {
  const router = useRouter()
  const [accountId, setAccountId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleConnect() {
    if (!accountId.trim()) {
      setError('Please enter your MetaAPI Account ID.')
      return
    }
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { error: dbError } = await supabase
        .from('users')
        .update({ mt5_account_id: accountId.trim(), mt5_connected: true })
        .eq('id', user.id)
      if (dbError) {
        setError(dbError.message)
        setLoading(false)
        return
      }
    }
    router.push('/onboarding/rules-setup')
  }

  async function handleSkip() {
    router.push('/onboarding/rules-setup')
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-medium text-foreground text-center">
        Connect your MT5 account
      </h1>
      <p className="mt-3 text-center text-sm text-ink-muted leading-relaxed">
        We use MetaAPI for read-only access. We never place or modify trades.
      </p>

      <div className="mt-8 space-y-2">
        <label htmlFor="mt5-account-id" className="block text-sm font-medium text-foreground">
          MetaAPI Account ID
        </label>
        <input
          id="mt5-account-id"
          type="text"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          placeholder="abc123def456"
          className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-foreground placeholder:text-ink-muted focus:border-anchor focus:outline-none focus:ring-2 focus:ring-lavender/60 transition-all"
        />
        <p className="text-xs text-ink-muted">
          Find this in your MetaAPI dashboard at metaapi.cloud
        </p>
      </div>

      {error && (
        <p className="mt-3 rounded-lg bg-danger-surface px-3 py-2 text-sm text-danger">{error}</p>
      )}

      <div className="mt-8 flex gap-3">
        <button
          onClick={handleSkip}
          className="flex-1 rounded-lg border border-border bg-paper px-6 py-2.5 text-sm font-medium text-foreground transition hover:border-ink-muted hover:opacity-80"
        >
          Skip for now
        </button>
        <button
          onClick={handleConnect}
          disabled={loading}
          className="flex-1 rounded-lg bg-anchor px-6 py-2.5 text-sm font-medium text-paper transition hover:opacity-90 disabled:opacity-60"
        >
          {loading ? 'Connecting…' : 'Connect & Continue'}
        </button>
      </div>
    </div>
  )
}
