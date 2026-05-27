'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { generateInsightsAction } from '@/app/actions/generate-insights-action'

export function RegenerateButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)
    await generateInsightsAction()
    router.refresh()
    setLoading(false)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border bg-white px-4 text-sm font-medium text-ink-muted transition-all hover:border-anchor/30 hover:text-anchor disabled:opacity-60"
    >
      {loading ? 'Analyzing...' : 'Regenerate'}
    </button>
  )
}
