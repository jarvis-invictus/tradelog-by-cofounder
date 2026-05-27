'use client'

import { Search } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'

interface TopbarProps {
  userName: string
  planTier: 'free' | 'pro'
  avatarUrl: string | null
}

export function Topbar({ userName, planTier, avatarUrl }: TopbarProps) {
  const router = useRouter()

  const initials = userName
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? '')
    .join('')

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  return (
    <header className="flex h-14 flex-shrink-0 items-center justify-between border-b border-rule bg-paper px-6">
      <div className="relative hidden w-64 md:block">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
        <input
          type="search"
          placeholder="Search trades…"
          className="w-full rounded-lg border border-rule bg-neutral py-2 pl-9 pr-3 text-sm text-anchor placeholder:text-ink-muted focus:border-anchor focus:outline-none focus:ring-2 focus:ring-lavender/60"
        />
      </div>

      <div className="ml-auto flex items-center gap-3">
        {planTier === 'pro' && (
          <Badge variant="neutral" className="bg-lavender text-anchor">Pro</Badge>
        )}

        <button
          type="button"
          onClick={handleSignOut}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-anchor text-xs font-medium text-paper transition-opacity hover:opacity-80"
          title={`${userName} — sign out`}
        >
          {avatarUrl ? (
            <Image src={avatarUrl} alt={userName} width={32} height={32} className="rounded-full object-cover" />
          ) : (
            initials
          )}
        </button>
      </div>
    </header>
  )
}
