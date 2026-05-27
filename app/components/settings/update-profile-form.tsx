'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Profile {
  full_name: string | null
  language: string | null
}

interface UpdateProfileFormProps {
  userId: string
  profile: Profile
}

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'Hindi' },
  { value: 'mr', label: 'Marathi' },
]

export function UpdateProfileForm({ userId, profile }: UpdateProfileFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [form, setForm] = useState({
    full_name: profile.full_name ?? '',
    language: profile.language ?? 'en',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    const supabase = createClient()
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        full_name: form.full_name,
        language: form.language,
      })
      .eq('id', userId)

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    router.refresh()
    setLoading(false)
    
    setTimeout(() => setSuccess(false), 2000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs font-medium uppercase tracking-wide text-ink-muted">
          Full Name
        </label>
        <input
          type="text"
          value={form.full_name}
          onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-anchor focus:border-anchor focus:outline-none"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium uppercase tracking-wide text-ink-muted">
          Language
        </label>
        <select
          value={form.language}
          onChange={(e) => setForm({ ...form, language: e.target.value })}
          className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-anchor focus:border-anchor focus:outline-none"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-anchor text-paper rounded-lg px-4 py-2 text-sm font-medium hover:opacity-90 transition disabled:opacity-60"
        >
          {loading ? 'Saving...' : 'Save changes'}
        </button>
        
        {success && (
          <span className="text-sm text-emerald-600 animate-pulse">Saved ✓</span>
        )}
        
        {error && (
          <span className="text-sm text-red-500">{error}</span>
        )}
      </div>
    </form>
  )
}
