import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { rateLimit, getClientIP } from '@/lib/ratelimit'
import { requireServerEnv } from '@/lib/env'

export async function POST(req: NextRequest) {
  try {
    // ✅ SECURITY: Rate limit — max 5 account inits per hour per IP
    const ip = getClientIP(req)
    const rl = rateLimit(ip, 'init-account', 5, 3600)
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabaseUrl = requireServerEnv('NEXT_PUBLIC_SUPABASE_URL')
    const serviceRoleKey = requireServerEnv('SUPABASE_SERVICE_ROLE_KEY')

    const serviceClient = createServiceClient(
      supabaseUrl,
      serviceRoleKey
    )

    const { data: existing } = await serviceClient
      .from('subscriptions')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!existing) {
      const { error } = await serviceClient
        .from('subscriptions')
        .insert({ user_id: user.id, plan: 'free' })

      if (error && error.code !== '23505') {
        console.error('init-account error:', error)
        return NextResponse.json({ error: 'Setup failed' }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('init-account error:', err)
    return NextResponse.json({ error: 'Account setup is temporarily unavailable.' }, { status: 500 })
  }
}
