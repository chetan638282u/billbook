'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AppShell from '@/components/AppShell'
import Link from 'next/link'
import { Plus, FileText } from '@/components/ui/icons'
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from '@/lib/utils'
import { PLAN_LIMITS } from '@/types'
import type { Client, Invoice, Plan } from '@/types'

type InvoiceWithClient = Invoice & { clients?: Pick<Client, 'name'> | null }

export default function InvoicesPage() {
  const router = useRouter()
  const [invoices, setInvoices] = useState<InvoiceWithClient[]>([])
  const [plan, setPlan] = useState<Plan>('free')
  const [monthlyCount, setMonthlyCount] = useState(0)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    async function loadInvoices() {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.replace('/auth/signin')
        return
      }

      const thisMonth = new Date()
      thisMonth.setDate(1)
      const [invoicesResult, subscriptionResult, monthlyCountResult] = await Promise.all([
        supabase.from('invoices').select('*, clients(name)').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('subscriptions').select('plan').eq('user_id', user.id).single(),
        supabase.from('invoices').select('*', { count: 'exact', head: true }).eq('user_id', user.id).gte('created_at', thisMonth.toISOString()),
      ])

      setInvoices((invoicesResult.data || []) as InvoiceWithClient[])
      setPlan((subscriptionResult.data?.plan || 'free') as Plan)
      setMonthlyCount(monthlyCountResult.count || 0)
      setLoaded(true)
    }

    void loadInvoices()
  }, [router])

  const limit = PLAN_LIMITS[plan]
  const atLimit = plan === 'free' && monthlyCount >= limit.invoices

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="page-title">Invoices</h1>
            {loaded && plan === 'free' && (
              <p className="text-sm text-gray-500 mt-1">{monthlyCount} / {limit.invoices} this month</p>
            )}
          </div>
          {atLimit ? (
            <Link href="/billing" className="btn-primary text-sm">Upgrade to create more</Link>
          ) : (
            <Link href="/invoices/new" className="btn-primary text-sm">
              <Plus className="w-4 h-4" /> New Invoice
            </Link>
          )}
        </div>

        <div className="card overflow-hidden">
          {!loaded ? (
            <div className="p-6 space-y-4" aria-hidden="true">
              <div className="h-4 w-3/4 rounded bg-gray-100" />
              <div className="h-4 w-1/2 rounded bg-gray-100" />
              <div className="h-4 w-5/6 rounded bg-gray-100" />
            </div>
          ) : invoices.length === 0 ? (
            <div className="py-16 text-center">
              <FileText className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500 font-medium mb-1">No invoices yet</p>
              <p className="text-sm text-gray-400 mb-5">Create your first GST-compliant invoice right now</p>
              <Link href="/invoices/new" className="btn-primary text-sm py-2">
                <Plus className="w-4 h-4" /> Create invoice
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Invoice #</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Client</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <Link href={`/invoices/${inv.id}`} className="font-semibold text-blue-600 hover:underline">
                          {inv.invoice_number}
                        </Link>
                      </td>
                      <td className="px-4 py-4 text-gray-700">{inv.clients?.name || '—'}</td>
                      <td className="px-4 py-4 text-gray-500">{formatDate(inv.invoice_date)}</td>
                      <td className="px-4 py-4">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusColor(inv.status)}`}>
                          {getStatusLabel(inv.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-gray-900">{formatCurrency(inv.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
