'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  BarChart2,
  BookOpen,
  ShieldCheck,
  Sparkles,
  Settings,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/trades', label: 'Trades', icon: BarChart2, exact: false },
  { href: '/dashboard/journal', label: 'Journal', icon: BookOpen, exact: false },
  { href: '/dashboard/rules', label: 'Rules', icon: ShieldCheck, exact: false },
  { href: '/dashboard/insights', label: 'Insights', icon: Sparkles, exact: false },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings, exact: false },
]

interface SidebarProps {
  plan?: 'free' | 'pro'
}

export function Sidebar({ plan = 'free' }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="hidden w-60 flex-shrink-0 flex-col bg-anchor md:flex">
      <div className="flex h-14 items-center px-6">
        <span className="font-display text-xl font-medium text-paper">tradelog</span>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 px-3 py-4">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-100',
                isActive
                  ? 'bg-white/10 text-paper'
                  : 'text-paper/60 hover:bg-white/5 hover:text-paper'
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-white/10 px-3 py-4 space-y-2">
        <div className="flex items-center gap-2 px-3 py-1.5">
          <span className={cn(
            'rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide',
            plan === 'pro' ? 'bg-lavender text-anchor' : 'bg-white/10 text-paper/60'
          )}>
            {plan === 'pro' ? 'Pro' : 'Free'}
          </span>
          {plan === 'free' && (
            <Link href="/dashboard/settings" className="text-xs text-paper/50 hover:text-paper transition-colors">
              Upgrade →
            </Link>
          )}
        </div>

        <button
          type="button"
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-paper/60 transition-all duration-100 hover:bg-white/5 hover:text-paper"
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          Sign out
        </button>
      </div>
    </aside>
  )
}
