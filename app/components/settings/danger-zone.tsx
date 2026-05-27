'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function DangerZone() {
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="border border-red-200 rounded-xl p-4">
      <h3 className="text-sm font-semibold text-anchor mb-3">Danger Zone</h3>
      <button
        type="button"
        onClick={handleSignOut}
        className="border border-red-300 text-red-600 rounded-lg px-4 py-2 text-sm hover:bg-red-50 transition"
      >
        Sign out
      </button>
    </div>
  )
}
