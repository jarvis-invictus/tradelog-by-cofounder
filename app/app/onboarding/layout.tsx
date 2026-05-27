'use client'

import { usePathname } from 'next/navigation'

const STEPS = ['welcome', 'language', 'mt5-connect', 'rules-setup', 'complete']

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const currentSlug = pathname.split('/').pop() ?? ''
  const currentIndex = STEPS.indexOf(currentSlug)

  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="w-full max-w-lg">
        <div className="mb-8 flex justify-center gap-2">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={[
                'h-2 w-2 rounded-full border transition-all',
                i < currentIndex
                  ? 'border-lavender bg-lavender'
                  : i === currentIndex
                  ? 'border-anchor bg-anchor'
                  : 'border-border bg-transparent',
              ].join(' ')}
            />
          ))}
        </div>
        {children}
      </div>
    </main>
  )
}
