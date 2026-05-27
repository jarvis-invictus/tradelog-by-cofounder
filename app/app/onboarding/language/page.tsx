'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const LANGUAGES = [
  { code: 'en', label: 'English', display: 'English' },
  { code: 'hi', label: 'Hindi', display: 'हिंदी' },
  { code: 'mr', label: 'Marathi', display: 'मराठी' },
]

export default function LanguagePage() {
  const router = useRouter()
  const [selected, setSelected] = useState('en')
  const [loading, setLoading] = useState(false)

  async function handleNext() {
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('users').update({ language: selected }).eq('id', user.id)
    }
    router.push('/onboarding/mt5-connect')
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-medium text-foreground text-center">Choose your language</h1>
      <div className="mt-8 grid grid-cols-3 gap-3">
        {LANGUAGES.map(({ code, label, display }) => (
          <button
            key={code}
            onClick={() => setSelected(code)}
            className={[
              'flex flex-col items-center justify-center rounded-xl border px-4 py-6 cursor-pointer transition-all',
              selected === code
                ? 'border-anchor bg-surface-inset'
                : 'border-border hover:border-ink-muted',
            ].join(' ')}
          >
            <span className="text-lg font-medium text-foreground">{display}</span>
            <span className="mt-1 text-xs text-ink-muted">{label}</span>
          </button>
        ))}
      </div>
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleNext}
          disabled={loading}
          className="rounded-lg bg-anchor px-8 py-2.5 text-sm font-medium text-paper transition hover:opacity-90 disabled:opacity-60"
        >
          {loading ? 'Saving…' : 'Next →'}
        </button>
      </div>
    </div>
  )
}
