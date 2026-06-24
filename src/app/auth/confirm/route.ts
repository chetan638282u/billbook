import { type EmailOtpType } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

// Verifies the one-time token from a password-reset email before the user sees
// the new-password form. This works reliably in mobile email browsers too.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next')
  const safeNext = next === '/auth/reset-password' ? next : '/auth/reset-password'

  const redirectUrl = new URL(safeNext, origin)
  redirectUrl.searchParams.set('recovery', '1')
  const response = NextResponse.redirect(redirectUrl)

  if (!tokenHash || type !== 'recovery') {
    return NextResponse.redirect(new URL('/auth/forgot-password?error=invalid_reset_link', origin))
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    }
  )

  const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type })

  if (error) {
    return NextResponse.redirect(new URL('/auth/forgot-password?error=invalid_reset_link', origin))
  }

  return response
}
