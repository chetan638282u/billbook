import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createBrowserClient(url, key)
}

// Password-recovery emails use Supabase's implicit flow, which delivers the
// one-time recovery session in the URL after the user opens the email link.
// Keep this separate so Google sign-in continues using its existing flow.
export function createRecoveryClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createBrowserClient(url, key, { auth: { flowType: 'implicit' } })
}
