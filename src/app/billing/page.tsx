'use client'

import { useEffect, useState } from 'react'
import AppShell from '@/components/AppShell'
import { CheckCircle, Loader2, CreditCard, Shield, Clock } from 'lucide-react'
import { PLANS, type Plan } from '@/types'

declare global { interface Window { Razorpay: any } }

const RAZORPAY_READY = !!(
  process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID &&
  process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID !== 'your_razorpay_key_id'
)

export default function BillingPage() {
  const [currentPlan, setCurrentPlan] = useState<Plan>('free')
  const [validUntil, setValidUntil] = useState<string | null>(null)
  const [loading, setLoading] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    async function load() {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUser(user)
      const { data } = await supabase
        .from('subscriptions')
        .select('plan, valid_until')
        .eq('user_id', user.id)
        .single()
      if (data) {
        setCurrentPlan(data.plan as Plan)
        setValidUntil(data.valid_until)
      }
    }
    load()
  }, [])

  const handleUpgrade = async (plan: Plan) => {
    if (!user) return
    setLoading(plan)
    setErrorMsg('')

    // Load Razorpay script
    if (!window.Razorpay) {
      await new Promise<void>((resolve) => {
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.onload = () => resolve()
        document.body.appendChild(script)
      })
    }

    const res = await fetch('/api/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan }),
    })
    const { orderId, amount, error } = await res.json()
    if (error || !orderId) {
      setErrorMsg(error || 'Failed to create order.')
      setLoading(null)
      return
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount,
      currency: 'INR',
      name: 'BillBook.in',
      description: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan — 1 Month`,
      order_id: orderId,
      prefill: { email: user.email, name: user.user_metadata?.full_name || '' },
      theme: { color: '#2563eb' },
      handler: async (response: any) => {
        const verifyRes = await fetch('/api/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            plan,
          }),
        })
        const { success } = await verifyRes.json()
        if (success) {
          setCurrentPlan(plan)
          setValidUntil(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString())
          setSuccessMsg(`You are now on the ${plan.charAt(0).toUpperCase() + plan.slice(1)} plan! 🎉`)
          setTimeout(() => setSuccessMsg(''), 6000)
        } else {
          setErrorMsg('Payment verification failed. Please contact support.')
        }
        setLoading(null)
      },
      modal: { ondismiss: () => setLoading(null) },
    }

    const rzp = new window.Razorpay(options)
    rzp.on('payment.failed', (r: any) => {
      setErrorMsg(`Payment failed: ${r.error.description}`)
      setLoading(null)
    })
    rzp.open()
  }

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="page-title">Billing & Plan</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your BillBook.in subscription</p>
        </div>

        {/* Razorpay not configured yet */}
        {!RAZORPAY_READY && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 mb-6 flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800">Payments coming soon</p>
              <p className="text-sm text-amber-700 mt-0.5">
                Razorpay integration is ready — just needs your API keys. 
                All features are free to use until payments are enabled.
              </p>
            </div>
          </div>
        )}

        {/* Current plan */}
        <div className="card p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Current plan</p>
              <p className="text-xl font-bold text-gray-900 capitalize">{currentPlan}</p>
              {validUntil && new Date(validUntil) > new Date() && (
                <p className="text-sm text-gray-500 mt-1">
                  Valid until {new Date(validUntil).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
              )}
            </div>
            <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
              currentPlan === 'free' ? 'bg-gray-100 text-gray-700' :
              currentPlan === 'starter' ? 'bg-blue-100 text-blue-700' :
              'bg-purple-100 text-purple-700'
            }`}>
              {currentPlan === 'free' ? 'Free' : currentPlan === 'starter' ? '₹199/mo' : '₹399/mo'}
            </div>
          </div>
        </div>

        {successMsg && (
          <div className="bg-green-50 border border-green-200 text-green-800 text-sm rounded-xl px-5 py-4 mb-5 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />{successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-5 py-4 mb-5">{errorMsg}</div>
        )}

        {/* Plan cards */}
        <div className="grid md:grid-cols-3 gap-4">
          {PLANS.map((plan) => {
            const isCurrent = currentPlan === plan.id
            return (
              <div key={plan.id} className={`card p-6 flex flex-col ${isCurrent ? 'ring-2 ring-blue-500' : ''}`}>
                {isCurrent && (
                  <div className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-2">Current plan</div>
                )}
                <h2 className="font-bold text-lg text-gray-900 mb-1">{plan.name}</h2>
                <div className="text-2xl font-extrabold text-gray-900 mb-4">
                  {plan.price === 0 ? '₹0' : `₹${plan.price}/mo`}
                </div>
                <ul className="space-y-2 flex-1 mb-5">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />{f}
                    </li>
                  ))}
                </ul>
                {isCurrent ? (
                  <div className="flex items-center justify-center gap-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg py-2">
                    <CheckCircle className="w-4 h-4" /> Active
                  </div>
                ) : plan.price === 0 ? null : RAZORPAY_READY ? (
                  <button onClick={() => handleUpgrade(plan.id)} disabled={!!loading}
                    className="btn-primary justify-center text-sm py-2 w-full">
                    {loading === plan.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                    {loading === plan.id ? 'Opening...' : `Upgrade to ${plan.name}`}
                  </button>
                ) : (
                  <div className="text-center text-xs text-gray-400 py-2 border border-gray-100 rounded-lg">
                    Payments coming soon
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-400">
          <Shield className="w-4 h-4" />
          {RAZORPAY_READY
            ? 'Payments secured by Razorpay · 256-bit SSL · No card data stored'
            : 'Secured by BillBook.in · Your data is safe on Supabase'}
        </div>
      </div>
    </AppShell>
  )
}
