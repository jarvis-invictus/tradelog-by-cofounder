import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { UpdateProfileForm } from '@/components/settings/update-profile-form'
import { ChangePasswordForm } from '@/components/settings/change-password-form'
import { DangerZone } from '@/components/settings/danger-zone'

export default async function SettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email, plan, avatar_url, language')
    .eq('id', user.id)
    .single()

  const isPro = profile?.plan === 'pro'
  const isEmailUser = user.app_metadata?.provider === 'email'

  return (
    <div className="max-w-xl space-y-8">
      <div>
        <p className="eyebrow mb-1">Settings</p>
        <h1 className="font-display text-2xl font-medium text-anchor">Account settings</h1>
      </div>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-anchor">Profile</h2>
        <div className="card p-4">
          <UpdateProfileForm 
            userId={user.id} 
            profile={{ full_name: profile?.full_name, language: profile?.language }} 
          />
        </div>
      </section>

      {isEmailUser && (
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-anchor">Password</h2>
          <div className="card p-4">
            <ChangePasswordForm isEmailUser={isEmailUser} />
          </div>
        </section>
      )}

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-anchor">Subscription</h2>
        {isPro ? (
          <div className="card flex items-start gap-3 p-4 bg-success-surface">
            <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-sage" />
            <div>
              <p className="text-sm font-medium text-anchor">tradelog Pro</p>
              <p className="mt-0.5 text-xs text-ink-muted">Your subscription is active.</p>
            </div>
          </div>
        ) : (
          <div className="card p-5">
            <p className="eyebrow mb-2">Free plan</p>
            <p className="mb-4 text-sm text-ink-muted">
              Upgrade to Pro for MT5 auto-sync, AI insights, rules engine, and full analytics.
            </p>
            <div className="mb-4 flex items-baseline gap-1">
              <span className="font-display text-3xl font-medium text-anchor">₹&thinsp;299</span>
              <span className="text-sm text-ink-muted">/month</span>
            </div>
            <button type="button" className="btn-primary w-full">Upgrade to Pro</button>
            <p className="mt-2 text-center text-xs text-ink-muted">Pay via UPI, card, or netbanking</p>
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-anchor">Session</h2>
        <DangerZone />
      </section>
    </div>
  )
}
