import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/src/lib/supabase/admin'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('x-razorpay-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(body)
    .digest('hex')

  if (signature !== expectedSignature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const event = JSON.parse(body) as {
    event: string
    payload: {
      subscription?: {
        entity: {
          id: string
          plan_id: string
          status: string
          current_start: number
          current_end: number
          notes?: { user_id?: string }
        }
      }
    }
  }

  const supabase = createAdminClient()

  if (event.event === 'subscription.activated' || event.event === 'subscription.charged') {
    const sub = event.payload.subscription?.entity
    if (!sub) return NextResponse.json({ ok: true })

    const userId = sub.notes?.user_id
    if (!userId) return NextResponse.json({ error: 'No user_id in notes' }, { status: 400 })

    await supabase.from('subscriptions').upsert(
      {
        user_id: userId,
        razorpay_subscription_id: sub.id,
        razorpay_plan_id: sub.plan_id,
        status: 'active',
        current_period_start: new Date(sub.current_start * 1000).toISOString(),
        current_period_end: new Date(sub.current_end * 1000).toISOString(),
      },
      { onConflict: 'razorpay_subscription_id' }
    )

    await supabase
      .from('users')
      .update({ plan_tier: 'pro' })
      .eq('id', userId)
  }

  if (event.event === 'subscription.cancelled' || event.event === 'subscription.expired') {
    const sub = event.payload.subscription?.entity
    if (!sub) return NextResponse.json({ ok: true })

    const userId = sub.notes?.user_id
    if (userId) {
      await supabase
        .from('subscriptions')
        .update({ status: sub.event === 'subscription.cancelled' ? 'cancelled' : 'expired' })
        .eq('razorpay_subscription_id', sub.id)

      await supabase
        .from('users')
        .update({ plan_tier: 'free' })
        .eq('id', userId)
    }
  }

  return NextResponse.json({ ok: true })
}
