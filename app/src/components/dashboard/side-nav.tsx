'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  TrendingUp,
  ShieldCheck,
  Lightbulb,
  BookOpen,
  Settings,
} from 'lucide-react'
import { cn } from '@/src/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/trades', label: 'Trades', icon: TrendingUp },
  { href: '/dashboard/rules', label: 'Rules', icon: ShieldCheck },
  { href: '/dashboard/insights', label: 'Insights', icon: Lightbulb },
  { href: '/dashboard/journal', label: 'Journal', icon: BookOpen },
]

export function SideNav() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-60 flex-shrink-0 flex-col border-r border-rule bg-paper md:flex">
      <div className="flex h-14 items-center border-b border-rule px-6">
        <span className="font-display text-xl font-medium text-anchor">tradelog</span>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 px-3 py-4">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-fast',
                isActive
                  ? 'bg-neutral text-anchor'
                  : 'text-ink-muted hover:bg-neutral/60 hover:text-anchor'
              )}
            >
              <Icon
                className={cn(
                  'h-4 w-4 flex-shrink-0 transition-colors duration-fast',
                  isActive ? 'text-anchor' : 'text-ink-muted group-hover:text-anchor'
                )}
              />
              {label}
              {isActive && (
                <span className="ml-auto h-5 w-0.5 rounded-full bg-lavender" />
              )}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-rule px-3 py-3">
        <Link
          href="/dashboard/settings"
          className={cn(
            'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-fast',
            pathname.startsWith('/dashboard/settings')
              ? 'bg-neutral text-anchor'
              : 'text-ink-muted hover:bg-neutral/60 hover:text-anchor'
          )}
        >
          <Settings className="h-4 w-4 flex-shrink-0" />
          Settings
        </Link>
      </div>
    </aside>
  )
}
