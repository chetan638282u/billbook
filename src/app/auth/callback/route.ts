import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

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
    const redirectResponse = NextResponse.redirect(`${origin}${safeNext}`)
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              redirectResponse.cookies.set(name, value, options)
            })
          },
        },
      }
    )
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // The database trigger creates the free subscription row automatically.
      return redirectResponse
    }
  }

  // Auth failed — redirect to signin with error message
  return NextResponse.redirect(`${origin}/auth/signin?error=confirmation_failed`)
}
