'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface ChangePasswordFormProps {
  isEmailUser: boolean
}

export function ChangePasswordForm({ isEmailUser }: ChangePasswordFormProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [form, setForm] = useState({
    password: '',
    confirm: '',
  })

  if (!isEmailUser) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    if (form.password !== form.confirm) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({
      password: form.password,
    })

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setForm({ password: '', confirm: '' })
    setLoading(false)
    
    setTimeout(() => setSuccess(false), 2000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs font-medium uppercase tracking-wide text-ink-muted">
          New Password
        </label>
        <input
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-anchor focus:border-anchor focus:outline-none"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium uppercase tracking-wide text-ink-muted">
          Confirm Password
        </label>
        <input
          type="password"
          value={form.confirm}
          onChange={(e) => setForm({ ...form, confirm: e.target.value })}
          className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-anchor focus:border-anchor focus:outline-none"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-anchor text-paper rounded-lg px-4 py-2 text-sm font-medium hover:opacity-90 transition disabled:opacity-60"
        >
          {loading ? 'Updating...' : 'Update password'}
        </button>
        
        {success && (
          <span className="text-sm text-emerald-600 animate-pulse">Password updated ✓</span>
        )}
        
        {error && (
          <span className="text-sm text-red-500">{error}</span>
        )}
      </div>
    </form>
  )
}
