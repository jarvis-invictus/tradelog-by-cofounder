'use client'
import { useEffect } from 'react'
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error) }, [error])
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-paper text-center px-6">
      <p className="font-mono text-xs uppercase tracking-widest text-ink-muted">Error</p>
      <h1 className="font-display text-3xl font-medium text-anchor">Something went wrong</h1>
      <p className="text-sm text-ink-muted">An unexpected error occurred.</p>
      <button onClick={reset} className="mt-2 bg-anchor text-paper rounded-lg px-4 py-2 text-sm font-medium hover:opacity-90">
        Try again
      </button>
    </div>
  )
}
