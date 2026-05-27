import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Check if profile exists, create if not
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, onboarding_complete')
        .eq('id', data.user.id)
        .single()

      if (!profile) {
        await supabase.from('profiles').insert({
          id: data.user.id,
          email: data.user.email,
          full_name: data.user.user_metadata?.full_name ?? '',
          avatar_url: data.user.user_metadata?.avatar_url ?? '',
        })
        return NextResponse.redirect(`${origin}/onboarding/welcome`)
      }

      return NextResponse.redirect(
        profile.onboarding_complete ? `${origin}/dashboard` : `${origin}/onboarding/welcome` 
      )
    }
  }

  return NextResponse.redirect(`${origin}/login?error=oauth`)
}
