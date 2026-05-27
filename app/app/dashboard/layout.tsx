import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/layout/sidebar'
import { Topbar } from '@/components/layout/topbar'
import { BottomNav } from '@/components/layout/bottom-nav'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('users')
    .select('full_name, plan, avatar_url')
    .eq('id', user.id)
    .single()

  return (
    <div className="flex h-screen overflow-hidden bg-paper">
      <Sidebar plan={(profile?.plan as 'free' | 'pro') ?? 'free'} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar
          userName={profile?.full_name ?? user.email ?? 'Trader'}
          planTier={(profile?.plan as 'free' | 'pro') ?? 'free'}
          avatarUrl={profile?.avatar_url ?? null}
        />
        <main className="flex-1 overflow-y-auto px-6 py-6 pb-16 md:pb-6">{children}</main>
        <BottomNav />
      </div>
    </div>
  )
}
