import Link from 'next/link'
import { CheckCircle, FileText } from 'lucide-react'
import { PLANS } from '@/types'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="border-b border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900">BillBook<span className="text-blue-600">.in</span></span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/auth/signin" className="text-sm text-gray-600 hover:text-gray-900">Sign in</Link>
            <Link href="/auth/signup" className="btn-primary text-sm py-2">Start Free</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Simple, honest pricing</h1>
          <p className="text-gray-500 text-lg">Start free. Pay only when you grow. All prices in ₹, billed monthly.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map((plan, i) => (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl border p-8 flex flex-col ${
                i === 1 ? 'border-blue-500 shadow-lg shadow-blue-100 relative' : 'border-gray-100'
              }`}
            >
              {i === 1 && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full">
                  MOST POPULAR
                </div>
              )}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h2>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-gray-900">
                    {plan.price === 0 ? '₹0' : `₹${plan.price}`}
                  </span>
                  {plan.price > 0 && <span className="text-gray-400 text-sm">/month</span>}
                </div>
                {plan.price === 0 && <p className="text-gray-400 text-sm mt-1">Forever free</p>}
              </div>

              <ul className="space-y-3 flex-1 mb-8">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.price === 0 ? '/auth/signup' : '/auth/signup'}
                className={
                  i === 1
                    ? 'btn-primary w-full justify-center'
                    : 'btn-secondary w-full justify-center'
                }
              >
                {plan.price === 0 ? 'Get started free' : `Start ${plan.name}`}
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently asked questions</h2>
          <div className="space-y-5">
            {[
              { q: 'Are invoices really GST-compliant?', a: 'Yes. Every invoice includes GSTIN fields, HSN/SAC codes, and auto-calculates CGST/SGST (same state) or IGST (different state) as per GST rules.' },
              { q: 'Can I download invoices as PDF?', a: 'Yes. Use the Print / PDF button on any invoice. Your browser will let you save it as a PDF file — free on all plans.' },
              { q: 'Is my data safe?', a: 'Your data is stored securely on Supabase (powered by AWS), with row-level security ensuring only you can access your invoices.' },
              { q: 'Can I cancel anytime?', a: 'Absolutely. If you cancel, you stay on the paid plan until the end of the month. No hidden charges.' },
              { q: 'Do you charge GST on the subscription?', a: 'Subscription payments via Razorpay are processed by BillBook.in. You will receive a receipt for each payment.' },
            ].map(({ q, a }) => (
              <div key={q} className="bg-white rounded-xl border border-gray-100 p-5">
                <p className="font-semibold text-gray-900 mb-1.5">{q}</p>
                <p className="text-sm text-gray-500">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
