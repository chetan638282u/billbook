'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AppShell from '@/components/AppShell'
import Link from 'next/link'
import { Plus, Users, Mail, Phone } from '@/components/ui/icons'
import { PLAN_LIMITS } from '@/types'
import type { Client, Plan } from '@/types'

export default function ClientsPage() {
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>([])
  const [plan, setPlan] = useState<Plan>('free')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    async function loadClients() {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.replace('/auth/signin')
        return
      }

      const [clientsResult, subscriptionResult] = await Promise.all([
        supabase.from('clients').select('*').eq('user_id', user.id).order('name'),
        supabase.from('subscriptions').select('plan').eq('user_id', user.id).single(),
      ])

      setClients((clientsResult.data || []) as Client[])
      setPlan((subscriptionResult.data?.plan || 'free') as Plan)
      setLoaded(true)
    }

    void loadClients()
  }, [router])

  const limit = PLAN_LIMITS[plan]
  const atLimit = clients.length >= limit.clients

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="page-title">Clients</h1>
            <p className="text-sm text-gray-500 mt-1">
              {loaded ? `${clients.length} ${limit.clients === Infinity ? '' : `/ ${limit.clients}`} clients` : ' '}
            </p>
          </div>
          {atLimit ? (
            <Link href="/billing" className="btn-primary text-sm">Upgrade to add more</Link>
          ) : (
            <Link href="/clients/new" className="btn-primary text-sm">
              <Plus className="w-4 h-4" /> Add Client
            </Link>
          )}
        </div>

        {loaded && atLimit && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 mb-5 text-sm text-amber-800">
            You&apos;ve reached the client limit for your plan.{' '}
            <Link href="/billing" className="underline font-medium">Upgrade for more</Link>
          </div>
        )}

        <div className="card overflow-hidden">
          {!loaded ? (
            <div className="p-6 space-y-4" aria-hidden="true">
              <div className="h-12 rounded bg-gray-100" />
              <div className="h-12 rounded bg-gray-100" />
              <div className="h-12 rounded bg-gray-100" />
            </div>
          ) : clients.length === 0 ? (
            <div className="py-16 text-center">
              <Users className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500 font-medium mb-1">No clients yet</p>
              <p className="text-sm text-gray-400 mb-5">Add your first client to start billing</p>
              <Link href="/clients/new" className="btn-primary text-sm py-2">
                <Plus className="w-4 h-4" /> Add client
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {clients.map((client) => (
                <Link
                  key={client.id}
                  href={`/clients/${client.id}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                      {client.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{client.name}</p>
                      {client.gstin && <p className="text-xs text-gray-500">GSTIN: {client.gstin}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    {client.email && (
                      <span className="hidden md:flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5" /> {client.email}
                      </span>
                    )}
                    {client.phone && (
                      <span className="hidden md:flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" /> {client.phone}
                      </span>
                    )}
                    <span className="text-gray-400 text-xs">{client.city || client.state}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
