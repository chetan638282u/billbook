export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AppShell from '@/components/AppShell'
import Link from 'next/link'
import { Plus, FileText, Search } from 'lucide-react'
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from '@/lib/utils'
import { PLAN_LIMITS } from '@/types'

export default async function InvoicesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/signin')

  const { data: invoices } = await supabase
    .from('invoices')
    .select('*, clients(name)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('plan')
    .eq('user_id', user.id)
    .single()

  const plan = subscription?.plan || 'free'
  const limit = PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS]

  const thisMonth = new Date(); thisMonth.setDate(1)
  const { count: monthlyCount } = await supabase
    .from('invoices')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('created_at', thisMonth.toISOString())

  const atLimit = plan === 'free' && (monthlyCount || 0) >= limit.invoices

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="page-title">Invoices</h1>
            {plan === 'free' && (
              <p className="text-sm text-gray-500 mt-1">{monthlyCount || 0} / {limit.invoices} this month</p>
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
          {!invoices || invoices.length === 0 ? (
            <div className="py-16 text-center">
              <FileText className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500 font-medium mb-1">No invoices yet</p>
              <p className="text-sm text-gray-400 mb-5">Create your first GST-compliant invoice right now</p>
              <Link href="/invoices/new" className="btn-primary text-sm py-2">
                <Plus className="w-4 h-4" /> Create invoice
              </Link>
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </AppShell>
  )
}
