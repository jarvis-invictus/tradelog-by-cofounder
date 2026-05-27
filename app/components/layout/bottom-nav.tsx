'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { House, BarChart2, BookOpen, ShieldCheck, Settings2 } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Home', icon: House },
  { href: '/dashboard/trades', label: 'Trades', icon: BarChart2 },
  { href: '/dashboard/journal', label: 'Journal', icon: BookOpen },
  { href: '/dashboard/rules', label: 'Rules', icon: ShieldCheck },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings2 },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-border bg-surface md:hidden">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const isActive = href === '/dashboard' ? pathname === href : pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className={[
              'flex flex-1 flex-col items-center justify-center gap-1 py-3 text-[10px] font-medium transition-colors',
              isActive ? 'text-anchor' : 'text-ink-muted hover:text-anchor',
            ].join(' ')}
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
