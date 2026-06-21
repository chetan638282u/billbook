import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

const PRODUCTION_APP_URL = 'https://billbook-ten.vercel.app'
type CookieToSet = {
  name: string
  value: string
  options: Parameters<NextResponse['cookies']['set']>[2]
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const next = searchParams.get('next') ?? '/dashboard'
  const safeNext = next.startsWith('/') ? next : '/dashboard'
  const cookiesToSet: CookieToSet[] = []

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(newCookies) {
          cookiesToSet.push(...newCookies)
        },
      },
    }
  )

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${PRODUCTION_APP_URL}/auth/callback?next=${encodeURIComponent(safeNext)}`,
    },
  })

  if (error || !data.url) {
    return NextResponse.redirect(`${PRODUCTION_APP_URL}/auth/signin?error=google_start_failed`)
  }

  const response = NextResponse.redirect(data.url)
  cookiesToSet.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options)
  })

  return response
}
