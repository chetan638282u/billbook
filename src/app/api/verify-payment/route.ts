import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { rateLimit, getClientIP } from '@/lib/ratelimit'

const VALID_PLANS = new Set(['starter', 'pro'])

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b))
}

export async function POST(req: NextRequest) {
  try {
    // ✅ SECURITY: Rate limit — max 10 verify attempts per hour per IP
    const ip = getClientIP(req)
    const rl = rateLimit(ip, 'verify-payment', 10, 3600)
    if (!rl.allowed) {
      return NextResponse.json({ success: false, error: 'Too many requests' }, { status: 429 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    let body: any
    try { body = await req.json() } catch {
      return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 })
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = body

    if (
      !razorpay_order_id || typeof razorpay_order_id !== 'string' ||
      !razorpay_payment_id || typeof razorpay_payment_id !== 'string' ||
      !razorpay_signature || typeof razorpay_signature !== 'string' ||
      !plan || typeof plan !== 'string'
    ) {
      return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 })
    }

    if (!VALID_PLANS.has(plan)) {
      return NextResponse.json({ success: false, error: 'Invalid plan' }, { status: 400 })
    }

    if (!razorpay_order_id.startsWith('order_') || !razorpay_payment_id.startsWith('pay_')) {
      return NextResponse.json({ success: false, error: 'Invalid payment data' }, { status: 400 })
    }

    // ✅ SECURITY: Validate ID lengths to prevent oversized inputs
    if (razorpay_order_id.length > 100 || razorpay_payment_id.length > 100 || razorpay_signature.length > 256) {
      return NextResponse.json({ success: false, error: 'Invalid payment data' }, { status: 400 })
    }

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    if (!safeEqual(expectedSignature, razorpay_signature)) {
      console.error(`[SECURITY] Signature mismatch for user ${user.id}`)
      return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 })
    }

    const serviceClient = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const validUntil = new Date()
    validUntil.setMonth(validUntil.getMonth() + 1)

    const { error } = await serviceClient
      .from('subscriptions')
      .upsert({
        user_id: user.id,
        plan,
        razorpay_payment_id,
        razorpay_order_id,
        valid_until: validUntil.toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' })

    if (error) {
      console.error('Subscription DB error:', error)
      return NextResponse.json({ success: false, error: 'DB error' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Verify payment error:', err)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}
