'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function SignupForm() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const form = new FormData(e.currentTarget)
    const supabase = createClient()

    const { error } = await supabase.auth.signUp({
      email: form.get('email') as string,
      password: form.get('password') as string,
      options: {
        data: { full_name: form.get('full_name') as string },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setDone(true)
    setLoading(false)
  }

  if (done) {
    return (
      <div className="rounded-lg bg-success-surface px-4 py-5 text-center">
        <p className="text-sm font-medium text-anchor">Check your email to confirm your account.</p>
        <p className="mt-1 text-xs text-ink-muted">
          We sent a confirmation link to your inbox.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="full_name"
        name="full_name"
        type="text"
        label="Full name"
        autoComplete="name"
        required
        placeholder="Rahul Sharma"
      />
      <Input
        id="email"
        name="email"
        type="email"
        label="Email"
        autoComplete="email"
        required
        placeholder="you@example.com"
      />
      <Input
        id="password"
        name="password"
        type="password"
        label="Password"
        autoComplete="new-password"
        required
        minLength={8}
        placeholder="Min 8 characters"
      />

      {error && (
        <p className="rounded-lg bg-danger-surface px-3 py-2 text-sm text-danger">{error}</p>
      )}

      <Button type="submit" variant="primary" loading={loading} className="w-full">
        Create free account
      </Button>

      <p className="text-center text-sm text-ink-muted">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-anchor underline underline-offset-4 hover:opacity-70">
          Sign in
        </Link>
      </p>
    </form>
  )
}
