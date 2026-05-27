'use client'

import { StatusCard } from '@/src/components/ui/status-card'
import type { Tables } from '@/src/lib/supabase/types'
import { formatShortDate } from '@/src/lib/utils'

interface SettingsClientProps {
  userId: string
  email: string
  profile: Tables<'users'> | null
  subscription: Tables<'subscriptions'> | null
}

export function SettingsClient({ email, profile, subscription }: SettingsClientProps) {
  const isPro = profile?.plan_tier === 'pro' && subscription?.status === 'active'

  return (
    <div className="space-y-8 max-w-xl">
      <div>
        <p className="eyebrow mb-1">Settings</p>
        <h1 className="font-display text-2xl font-medium text-anchor">Account settings</h1>
      </div>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-anchor">Profile</h2>
        <div className="card divide-y divide-rule overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <p className="text-sm text-ink-muted">Name</p>
            <p className="text-sm font-medium text-anchor">{profile?.full_name ?? '—'}</p>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <p className="text-sm text-ink-muted">Email</p>
            <p className="text-sm font-medium text-anchor">{email}</p>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <p className="text-sm text-ink-muted">MT5 account</p>
            <p className="text-sm font-medium text-anchor">{profile?.mt5_account_id ?? 'Not connected'}</p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-anchor">Subscription</h2>
        {isPro ? (
          <StatusCard
            variant="success"
            title="tradelog Pro"
            description={subscription?.current_period_end ? `Renews ${formatShortDate(subscription.current_period_end)}` : undefined}
          />
        ) : (
          <div className="card p-5">
            <p className="eyebrow mb-2">Free plan</p>
            <p className="mb-4 text-sm text-ink-muted">
              Upgrade to Pro for MT5 auto-sync, AI insights, rules engine, and full analytics.
            </p>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="font-display text-3xl font-medium text-anchor">&#x20B9;&#8202;299</span>
              <span className="text-sm text-ink-muted">/month</span>
            </div>
            <button type="button" className="btn-primary w-full">
              Upgrade to Pro
            </button>
            <p className="mt-2 text-center text-xs text-ink-muted">Pay via UPI, card, or netbanking</p>
          </div>
        )}
      </section>
    </div>
  )
}
