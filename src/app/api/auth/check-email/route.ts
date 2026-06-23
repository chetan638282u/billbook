import { NextRequest, NextResponse } from 'next/server'
import { findAuthUserByEmail } from '@/lib/supabase/admin'
import { getClientIP, rateLimit } from '@/lib/ratelimit'

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request)
    const rl = rateLimit(ip, 'auth-check-email', 30, 3600)
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Too many attempts. Please try again later.' }, { status: 429 })
    }

    const { email } = await request.json()
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : ''

    if (!normalizedEmail || normalizedEmail.length > 254 || !normalizedEmail.includes('@')) {
      return NextResponse.json({ exists: false })
    }

    const user = await findAuthUserByEmail(normalizedEmail)
    return NextResponse.json({ exists: Boolean(user) })
  } catch (error) {
    console.error('check-email error:', error)
    return NextResponse.json({ error: 'Account check is temporarily unavailable.' }, { status: 500 })
  }
}
