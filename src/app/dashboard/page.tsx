export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AppShell from '@/components/AppShell'
import Link from 'next/link'
import { FileText, Users, TrendingUp, Clock, Plus, ArrowRight, AlertCircle } from 'lucide-react'
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from '@/lib/utils'
import { PLAN_LIMITS } from '@/types'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/signin')

  const [
    { data: invoices },
    { data: clients },
    { data: subscription },
    { data: business },
  ] = await Promise.all([
    supabase.from('invoices').select('*, clients(name)').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
    supabase.from('clients').select('id').eq('user_id', user.id),
    supabase.from('subscriptions').select('*').eq('user_id', user.id).single(),
    supabase.from('businesses').select('name').eq('user_id', user.id).single(),
  ])

  const plan = subscription?.plan || 'free'
  const limit = PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS]

  // Count this month's invoices
  const thisMonth = new Date()
  thisMonth.setDate(1)
  const { count: monthlyCount } = await supabase
    .from('invoices')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('created_at', thisMonth.toISOString())

  const totalRevenue = invoices?.reduce((sum, inv) => sum + (inv.status === 'paid' ? inv.total : 0), 0) || 0
  const unpaidCount = invoices?.filter(inv => inv.status === 'sent' || inv.status === 'overdue').length || 0

  const atLimit = plan === 'free' && (monthlyCount || 0) >= limit.invoices

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="page-title">
              {business?.name ? `Welcome back` : 'Dashboard'}
            </h1>
            {business?.name && (
              <p className="text-gray-500 mt-1">{business.name}</p>
            )}
          </div>
          {atLimit ? (
            <Link href="/billing" className="btn-primary text-sm">
              <AlertCircle className="w-4 h-4" /> Upgrade to create more
            </Link>
          ) : (
            <Link href="/invoices/new" className="btn-primary text-sm">
              <Plus className="w-4 h-4" /> New Invoice
            </Link>
          )}
        </div>

        {/* Plan limit warning */}
        {plan === 'free' && (monthlyCount || 0) >= 3 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800">
                {atLimit ? 'You have reached your free plan limit (5 invoices/month).' : `You've used ${monthlyCount} of 5 free invoices this month.`}
              </p>
              <Link href="/billing" className="text-sm text-amber-700 underline font-medium">
                Upgrade for ₹149/month →
              </Link>
            </div>
          </div>
        )}

        {/* Business setup nudge */}
        {!business?.name && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-4 mb-6 flex items-center justify-between gap-4">
            <p className="text-sm text-blue-800 font-medium">Set up your business profile to appear on invoices</p>
            <Link href="/settings" className="btn-primary text-sm py-2">Set up now</Link>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total invoices', value: invoices?.length || 0, icon: FileText, color: 'text-blue-600 bg-blue-50' },
            { label: 'Clients', value: clients?.length || 0, icon: Users, color: 'text-purple-600 bg-purple-50' },
            { label: 'Revenue (paid)', value: formatCurrency(totalRevenue), icon: TrendingUp, color: 'text-green-600 bg-green-50', wide: true },
            { label: 'Awaiting payment', value: unpaidCount, icon: Clock, color: 'text-orange-600 bg-orange-50' },
          ].map((stat) => (
            <div key={stat.label} className={`card p-5 ${stat.wide ? 'col-span-2 md:col-span-1' : ''}`}>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${stat.color}`}>
                <stat.icon className="w-4 h-4" />
              </div>
              <div className="text-xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Recent invoices */}
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="section-title">Recent invoices</h2>
            <Link href="/invoices" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {!invoices || invoices.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No invoices yet</p>
              <p className="text-sm text-gray-400 mb-4">Create your first GST invoice in under a minute</p>
              <Link href="/invoices/new" className="btn-primary text-sm py-2">
                <Plus className="w-4 h-4" /> Create first invoice
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {invoices.map((inv) => (
                <Link
                  key={inv.id}
                  href={`/invoices/${inv.id}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{inv.invoice_number}</p>
                    <p className="text-xs text-gray-500">{inv.clients?.name || 'No client'} · {formatDate(inv.invoice_date)}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusColor(inv.status)}`}>
                      {getStatusLabel(inv.status)}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">{formatCurrency(inv.total)}</span>
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
