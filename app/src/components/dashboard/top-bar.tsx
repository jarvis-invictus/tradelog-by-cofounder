'use client'

import { Search, Bell } from 'lucide-react'
import { signOut } from '@/src/actions/auth'
import { cn } from '@/src/lib/utils'

interface TopBarProps {
  userName: string
  planTier: 'free' | 'pro'
  avatarUrl: string | null
}

export function TopBar({ userName, planTier, avatarUrl }: TopBarProps) {
  const initials = userName
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? '')
    .join('')

  return (
    <header className="flex h-14 flex-shrink-0 items-center justify-between border-b border-rule bg-paper px-6">
      <div className="relative hidden w-64 md:block">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
        <input
          type="search"
          placeholder="Search trades…"
          className="w-full rounded-control border border-rule bg-neutral py-2 pl-9 pr-3 text-sm text-anchor placeholder:text-ink-muted focus:border-anchor focus:outline-none focus:shadow-focus-ring"
        />
      </div>

      <div className="flex items-center gap-3 ml-auto">
        <button
          type="button"
          className="relative rounded-control p-2 text-ink-muted transition-colors hover:bg-neutral hover:text-anchor"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2">
          {planTier === 'pro' && (
            <span className="font-mono text-[10px] uppercase tracking-wider rounded-pill bg-lavender px-2 py-0.5 text-anchor">
              Pro
            </span>
          )}
          <form action={signOut}>
            <button
              type="submit"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-anchor text-xs font-medium text-paper transition-opacity hover:opacity-80"
              title={`${userName} — sign out`}
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt={userName} className="h-full w-full rounded-full object-cover" />
              ) : (
                initials
              )}
            </button>
          </form>
        </div>
      </div>
    </header>
  )
}
