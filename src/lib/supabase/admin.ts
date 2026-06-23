import { createClient as createServiceClient } from '@supabase/supabase-js'
import { requireServerEnv } from '@/lib/env'

export function createAdminClient() {
  return createServiceClient(
    requireServerEnv('NEXT_PUBLIC_SUPABASE_URL'),
    requireServerEnv('SUPABASE_SERVICE_ROLE_KEY')
  )
}

export async function findAuthUserByEmail(email: string) {
  const admin = createAdminClient()
  const normalizedEmail = email.trim().toLowerCase()
  let page = 1

  while (page <= 20) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 })
    if (error) throw error

    const user = data.users.find((item) => item.email?.toLowerCase() === normalizedEmail)
    if (user) return user
    if (data.users.length < 1000) return null

    page += 1
  }

  return null
}
