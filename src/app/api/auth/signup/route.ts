import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient, findAuthUserByEmail } from '@/lib/supabase/admin'
import { getClientIP, rateLimit } from '@/lib/ratelimit'

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request)
    const rl = rateLimit(ip, 'manual-signup', 10, 3600)
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Too many signup attempts. Please try again later.' }, { status: 429 })
    }

    const { name, email, password } = await request.json()
    const fullName = typeof name === 'string' ? name.trim().slice(0, 100) : ''
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : ''

    if (!fullName) {
      return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 })
    }

    if (!normalizedEmail || normalizedEmail.length > 254 || !normalizedEmail.includes('@')) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }

    if (typeof password !== 'string' || password.length < 8 || password.length > 128) {
      return NextResponse.json({ error: 'Password must be between 8 and 128 characters.' }, { status: 400 })
    }

    const existingUser = await findAuthUserByEmail(normalizedEmail)
    if (existingUser) {
      return NextResponse.json({ error: 'An account already exists with this email. Please sign in.' }, { status: 409 })
    }

    const admin = createAdminClient()
    const { data, error } = await admin.auth.admin.createUser({
      email: normalizedEmail,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    })

    if (error || !data.user) {
      console.error('manual-signup create user error:', error)
      return NextResponse.json({ error: error?.message || 'Account could not be created.' }, { status: 400 })
    }

    const { error: subscriptionError } = await admin
      .from('subscriptions')
      .upsert({ user_id: data.user.id, plan: 'free' }, { onConflict: 'user_id', ignoreDuplicates: true })

    if (subscriptionError && subscriptionError.code !== '23505') {
      console.error('manual-signup subscription error:', subscriptionError)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('manual-signup error:', error)
    return NextResponse.json({ error: 'Account creation is temporarily unavailable.' }, { status: 500 })
  }
}
