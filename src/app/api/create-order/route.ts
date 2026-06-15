import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { rateLimit, getClientIP } from '@/lib/ratelimit'

const PLAN_PRICES = Object.assign(Object.create(null) as Record<string, number>, {
  starter: 14900,
  pro: 34900,
})

export async function POST(req: NextRequest) {
  try {
    // Check Razorpay is configured
    const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
    const razorpaySecret = process.env.RAZORPAY_KEY_SECRET
    if (!razorpayKeyId || razorpayKeyId === 'your_razorpay_key_id' || !razorpaySecret) {
      return NextResponse.json({ error: 'Payments not yet configured. Please contact support.' }, { status: 503 })
    }

    // Rate limit
    const ip = getClientIP(req)
    const rl = rateLimit(ip, 'create-order', 10, 3600)
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
    }

    // Auth check
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const userRL = rateLimit(user.id, 'create-order-user', 5, 3600)
    if (!userRL.allowed) {
      return NextResponse.json({ error: 'Too many payment attempts. Please try again in an hour.' }, { status: 429 })
    }

    let body: any
    try { body = await req.json() } catch {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const { plan } = body
    if (!plan || typeof plan !== 'string' || !Object.prototype.hasOwnProperty.call(PLAN_PRICES, plan)) {
      return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 })
    }

    const amount = PLAN_PRICES[plan]

    const { data: existing } = await supabase
      .from('subscriptions').select('plan, valid_until').eq('user_id', user.id).single()

    if (existing?.plan === plan && existing?.valid_until) {
      if (new Date(existing.valid_until) > new Date()) {
        return NextResponse.json({ error: 'Already subscribed to this plan' }, { status: 400 })
      }
    }

    // Dynamically import Razorpay only when keys are available
    const Razorpay = (await import('razorpay')).default
    const razorpay = new Razorpay({ key_id: razorpayKeyId, key_secret: razorpaySecret })

    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: `bb_${user.id.slice(0, 8)}_${Date.now()}`,
      notes: { userId: user.id, plan, userEmail: user.email ?? '' },
    })

    return NextResponse.json({ orderId: order.id, amount, plan })
  } catch (err) {
    console.error('Razorpay order error:', err)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
