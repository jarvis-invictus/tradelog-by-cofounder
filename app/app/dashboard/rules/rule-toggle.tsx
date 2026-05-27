'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface RuleToggleProps {
  ruleId: string
  enabled: boolean
}

export function RuleToggle({ ruleId, enabled }: RuleToggleProps) {
  const router = useRouter()

  async function toggleRule() {
    const supabase = createClient()
    await supabase.from('rules').update({ enabled: !enabled }).eq('id', ruleId)
    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={toggleRule}
      className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
      style={{ backgroundColor: enabled ? '#10b981' : '#e5e7eb' }}
      aria-label={enabled ? 'Disable rule' : 'Enable rule'}
    >
      <span
        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-5' : 'translate-x-1'
        }`}
      />
    </button>
  )
}
