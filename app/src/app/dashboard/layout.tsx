import { redirect } from 'next/navigation'
import { createClient } from '@/src/lib/supabase/server'
import { SideNav } from '@/src/components/dashboard/side-nav'
import { TopBar } from '@/src/components/dashboard/top-bar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('users')
    .select('full_name, plan_tier, avatar_url')
    .eq('id', user.id)
    .single()

  return (
    <div className="flex h-screen overflow-hidden bg-paper">
      <SideNav />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar
          userName={profile?.full_name ?? user.email ?? 'Trader'}
          planTier={profile?.plan_tier ?? 'free'}
          avatarUrl={profile?.avatar_url ?? null}
        />
        <main className="flex-1 overflow-y-auto px-6 py-6">{children}</main>
      </div>
    </div>
  )
}
