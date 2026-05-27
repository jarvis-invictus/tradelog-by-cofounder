'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const LANGUAGE_LABELS: Record<string, string> = {
  en: 'English',
  hi: 'Hindi (हिंदी)',
  mr: 'Marathi (मराठी)',
}

interface Props {
  language: string
  mt5Connected: boolean
  rulesCount: number
}

export default function CompleteClient({ language, mt5Connected, rulesCount }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleGoToDashboard() {
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('users').update({ onboarding_complete: true }).eq('id', user.id)
    }
    router.push('/dashboard')
  }

  return (
    <div className="text-center">
      <h1 className="font-display text-4xl font-medium text-foreground">You&apos;re ready.</h1>

      <div className="mt-8 rounded-xl border border-border bg-surface p-6 text-left space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <span className="text-sm text-ink-muted">Language</span>
          <span className="text-sm font-medium text-foreground">
            {LANGUAGE_LABELS[language] ?? language}
          </span>
        </div>
        <div className="flex items-center justify-between border-b border-border pb-4">
          <span className="text-sm text-ink-muted">MT5 Account</span>
          <span className={['text-sm font-medium', mt5Connected ? 'text-success' : 'text-ink-muted'].join(' ')}>
            {mt5Connected ? 'Connected' : 'Skipped'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-ink-muted">Rules set</span>
          <span className="text-sm font-medium text-foreground">
            {rulesCount} rule{rulesCount !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <div className="mt-8">
        <button
          onClick={handleGoToDashboard}
          disabled={loading}
          className="inline-flex items-center justify-center rounded-lg bg-anchor px-10 py-2.5 text-sm font-medium text-paper transition hover:opacity-90 disabled:opacity-60"
        >
          {loading ? 'Loading…' : 'Go to Dashboard'}
        </button>
      </div>
    </div>
  )
}
