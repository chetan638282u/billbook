'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AppShell from '@/components/AppShell'
import Link from 'next/link'
import { FileText, Users, TrendingUp, Clock, Plus, ArrowRight, AlertCircle } from '@/components/ui/icons'
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from '@/lib/utils'
import { PLAN_LIMITS, type Client, type Invoice, type Plan } from '@/types'

type DashboardInvoice = Invoice & { clients?: Pick<Client, 'name'> | null }

type DashboardData = {
  invoices: DashboardInvoice[]
  clientCount: number
  plan: Plan
  businessName: string | null
  monthlyCount: number
  hasWarning: boolean
}

export default function DashboardPage() {
  const router = useRouter()
  const [data, setData] = useState<DashboardData>({
    invoices: [], clientCount: 0, plan: 'free', businessName: null, monthlyCount: 0, hasWarning: false,
  })
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    async function loadDashboard() {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.replace('/auth/signin')
        return
      }

      const thisMonth = new Date()
      thisMonth.setDate(1)
      const [invoicesResult, clientsResult, subscriptionResult, businessResult, monthlyCountResult] = await Promise.all([
        supabase.from('invoices').select('*, clients(name)').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
        supabase.from('clients').select('id').eq('user_id', user.id),
        supabase.from('subscriptions').select('plan').eq('user_id', user.id).maybeSingle(),
        supabase.from('businesses').select('name').eq('user_id', user.id).maybeSingle(),
        supabase.from('invoices').select('*', { count: 'exact', head: true }).eq('user_id', user.id).gte('created_at', thisMonth.toISOString()),
      ])

      setData({
        invoices: (invoicesResult.data || []) as DashboardInvoice[],
        clientCount: clientsResult.data?.length || 0,
        plan: (subscriptionResult.data?.plan || 'free') as Plan,
        businessName: businessResult.data?.name || null,
        monthlyCount: monthlyCountResult.count || 0,
        hasWarning: Boolean(invoicesResult.error || clientsResult.error || subscriptionResult.error || businessResult.error || monthlyCountResult.error),
      })
      setLoaded(true)
    }

    void loadDashboard()
  }, [router])

  const limit = PLAN_LIMITS[data.plan]
  const atLimit = data.plan === 'free' && data.monthlyCount >= limit.invoices
  const totalRevenue = data.invoices.reduce((sum, invoice) => sum + (invoice.status === 'paid' ? invoice.total : 0), 0)
  const unpaidCount = data.invoices.filter((invoice) => invoice.status === 'sent' || invoice.status === 'overdue').length

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="page-title">{data.businessName ? 'Welcome back' : 'Dashboard'}</h1>
            {data.businessName && <p className="text-gray-500 mt-1">{data.businessName}</p>}
          </div>
          {loaded && atLimit ? (
            <Link href="/billing" className="btn-primary text-sm"><AlertCircle className="w-4 h-4" /> Upgrade to create more</Link>
          ) : (
            <Link href="/invoices/new" className="btn-primary text-sm"><Plus className="w-4 h-4" /> New Invoice</Link>
          )}
        </div>

        {loaded && data.hasWarning && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div><p className="text-sm font-medium text-amber-800">Some dashboard data could not load.</p><p className="text-sm text-amber-700 mt-0.5">Refresh the page. If it continues, sign out and sign in again.</p></div>
          </div>
        )}

        {loaded && data.plan === 'free' && data.monthlyCount >= 3 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div><p className="text-sm font-medium text-amber-800">{atLimit ? 'You have reached your free plan limit (5 invoices/month).' : `You've used ${data.monthlyCount} of 5 free invoices this month.`}</p><Link href="/billing" className="text-sm text-amber-700 underline font-medium">Upgrade for ₹149/month →</Link></div>
          </div>
        )}

        {loaded && !data.businessName && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-4 mb-6 flex items-center justify-between gap-4">
            <p className="text-sm text-blue-800 font-medium">Set up your business profile to appear on invoices</p><Link href="/settings" className="btn-primary text-sm py-2">Set up now</Link>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total invoices', value: data.invoices.length, icon: FileText, color: 'text-blue-600 bg-blue-50' },
            { label: 'Clients', value: data.clientCount, icon: Users, color: 'text-purple-600 bg-purple-50' },
            { label: 'Revenue (paid)', value: formatCurrency(totalRevenue), icon: TrendingUp, color: 'text-green-600 bg-green-50' },
            { label: 'Awaiting payment', value: unpaidCount, icon: Clock, color: 'text-orange-600 bg-orange-50' },
          ].map((stat) => (
            <div key={stat.label} className="card p-5">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${stat.color}`}><stat.icon className="w-4 h-4" /></div>
              <div className={`text-xl font-bold text-gray-900 ${loaded ? '' : 'text-transparent bg-gray-100 rounded w-10'}`}>{loaded ? stat.value : '0'}</div>
              <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between"><h2 className="section-title">Recent invoices</h2><Link href="/invoices" className="text-sm text-blue-600 hover:underline flex items-center gap-1">View all <ArrowRight className="w-3.5 h-3.5" /></Link></div>
          {!loaded ? (
            <div className="p-6 space-y-4" aria-hidden="true"><div className="h-4 w-3/4 rounded bg-gray-100" /><div className="h-4 w-1/2 rounded bg-gray-100" /><div className="h-4 w-5/6 rounded bg-gray-100" /></div>
          ) : data.invoices.length === 0 ? (
            <div className="px-6 py-12 text-center"><FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" /><p className="text-gray-500 font-medium">No invoices yet</p><p className="text-sm text-gray-400 mb-4">Create your first GST invoice in under a minute</p><Link href="/invoices/new" className="btn-primary text-sm py-2"><Plus className="w-4 h-4" /> Create first invoice</Link></div>
          ) : (
            <div className="divide-y divide-gray-50">{data.invoices.map((invoice) => <Link key={invoice.id} href={`/invoices/${invoice.id}`} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"><div><p className="text-sm font-semibold text-gray-900">{invoice.invoice_number}</p><p className="text-xs text-gray-500">{invoice.clients?.name || 'No client'} · {formatDate(invoice.invoice_date)}</p></div><div className="flex items-center gap-4"><span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusColor(invoice.status)}`}>{getStatusLabel(invoice.status)}</span><span className="text-sm font-semibold text-gray-900">{formatCurrency(invoice.total)}</span></div></Link>)}</div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
