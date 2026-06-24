import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { PRODUCTION_APP_URL, requireServerEnv } from '@/lib/env'
import { findAuthUserByEmail } from '@/lib/supabase/admin'
import { getClientIP, rateLimit } from '@/lib/ratelimit'

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request)
    const rl = rateLimit(ip, 'forgot-password', 10, 3600)
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Too many reset attempts. Please try again later.' }, { status: 429 })
    }

    const { email } = await request.json()
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : ''

    if (!normalizedEmail || normalizedEmail.length > 254 || !normalizedEmail.includes('@')) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }

    const user = await findAuthUserByEmail(normalizedEmail)
    if (!user) {
      return NextResponse.json({ error: 'No account found with this email. Please create an account first.' }, { status: 404 })
    }

    const supabase = createClient(
      requireServerEnv('NEXT_PUBLIC_SUPABASE_URL'),
      requireServerEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
      { auth: { flowType: 'implicit' } }
    )

    const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
      redirectTo: `${PRODUCTION_APP_URL}/auth/reset-password`,
    })

    if (error) {
      console.error('forgot-password reset error:', error)
      return NextResponse.json({ error: error.message || 'Password reset email could not be sent.' }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('forgot-password error:', error)
    return NextResponse.json({ error: 'Password reset is temporarily unavailable.' }, { status: 500 })
  }
}
