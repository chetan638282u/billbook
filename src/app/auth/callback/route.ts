import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Supabase Auth Callback
 * Handles email confirmation links and OAuth redirects.
 * Without this, clicking the confirmation email gives a 404.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  // ✅ SECURITY: Only allow relative redirects — no open redirect
  const safeNext = next.startsWith('/') ? next : '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // The database trigger creates the free subscription row automatically.
      return NextResponse.redirect(`${origin}${safeNext}`)
    }
  }

  // Auth failed — redirect to signin with error message
  return NextResponse.redirect(`${origin}/auth/signin?error=confirmation_failed`)
}
