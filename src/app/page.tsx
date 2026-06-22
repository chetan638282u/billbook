import Link from 'next/link'
import { redirect } from 'next/navigation'
import { FileText, CheckCircle, Download, Shield, Users, TrendingUp, ArrowRight, Star } from 'lucide-react'
import ScrollReveal from '@/components/ui/ScrollReveal'

export default async function LandingPage({
  searchParams,
}: {
  searchParams?: Promise<{ code?: string; next?: string }>
}) {
  const params = await searchParams
  if (params?.code) {
    const callbackParams = new URLSearchParams({ code: params.code })
    if (params.next?.startsWith('/')) callbackParams.set('next', params.next)
    redirect(`/auth/callback?${callbackParams.toString()}`)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900">BillBook<span className="text-blue-600">.in</span></span>
            </div>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
              <Link href="#features" className="hover:text-blue-600 transition-colors">Features</Link>
              <Link href="#features" className="hover:text-blue-600 transition-colors">Knowledge</Link>
              <Link href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/signin" className="text-sm font-medium text-gray-600 hover:text-gray-900">Sign in</Link>
            <Link href="/auth/signup" className="btn-primary text-sm py-2">Start Free</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-20 pb-16 text-center">
        <ScrollReveal direction="down">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium px-4 py-2 rounded-full mb-6">
            <Shield className="w-4 h-4" />
            100% GST-Compliant Invoices for India
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            Create GST invoices<br />
            <span className="text-blue-600">in 60 seconds</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
            The simplest billing tool for Indian freelancers, consultants, and small businesses. No CA needed. Just bill and get paid.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/signup" className="btn-primary text-base px-8 py-3.5 w-full sm:w-auto justify-center">
              Create your first invoice free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-sm text-gray-400">No credit card required</p>
          </div>
        </ScrollReveal>

        {/* Trust bar */}
        <ScrollReveal delay={120}>
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-400">
            <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-green-500" /> Bank-grade encryption</div>
            <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> GST-compliant format</div>
            <div className="flex items-center gap-2"><Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /> Trusted by 500+ businesses</div>
            <div className="flex items-center gap-2"><Download className="w-4 h-4 text-blue-500" /> Instant PDF download</div>
          </div>
        </ScrollReveal>
      </section>

      {/* Screenshot mockup */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <ScrollReveal>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-6 md:p-10">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Fake invoice preview */}
            <div className="bg-blue-600 px-6 py-4 flex items-center justify-between">
              <div className="text-white font-bold text-lg">Invoice #INV-2025-0001</div>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                <div className="w-3 h-3 rounded-full bg-blue-300"></div>
                <div className="w-3 h-3 rounded-full bg-blue-200"></div>
              </div>
            </div>
            <div className="p-6 grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">From</p>
                <p className="font-semibold text-gray-900">Rahul Sharma Design Studio</p>
                <p className="text-sm text-gray-500">GSTIN: 07AABCU9603R1ZX</p>
                <p className="text-sm text-gray-500">Delhi, India</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">To</p>
                <p className="font-semibold text-gray-900">TechCorp Pvt. Ltd.</p>
                <p className="text-sm text-gray-500">Mumbai, Maharashtra</p>
              </div>
              <div className="md:col-span-2">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                    <tr>
                      <th className="text-left px-3 py-2">Description</th>
                      <th className="text-right px-3 py-2">Qty</th>
                      <th className="text-right px-3 py-2">Rate</th>
                      <th className="text-right px-3 py-2">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    <tr>
                      <td className="px-3 py-2">Website Design & Development</td>
                      <td className="px-3 py-2 text-right">1</td>
                      <td className="px-3 py-2 text-right">₹50,000</td>
                      <td className="px-3 py-2 text-right font-medium">₹50,000</td>
                    </tr>
                  </tbody>
                </table>
                <div className="mt-4 border-t pt-4 flex justify-end">
                  <div className="text-right space-y-1">
                    <div className="flex gap-8 text-sm text-gray-500"><span>Subtotal</span><span>₹50,000</span></div>
                    <div className="flex gap-8 text-sm text-gray-500"><span>CGST (9%)</span><span>₹4,500</span></div>
                    <div className="flex gap-8 text-sm text-gray-500"><span>SGST (9%)</span><span>₹4,500</span></div>
                    <div className="flex gap-8 text-base font-bold text-gray-900 border-t pt-2 mt-2"><span>Total</span><span>₹59,000</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Features */}
      <section id="features" className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <ScrollReveal direction="down">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything you need to bill professionally</h2>
              <p className="text-gray-500 text-lg max-w-xl mx-auto">Built specifically for how Indian businesses work — GSTIN, HSN codes, CGST/SGST/IGST, all handled.</p>
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: FileText, title: 'GST-Compliant PDFs', desc: 'Every invoice meets GST format requirements with GSTIN, HSN/SAC codes, CGST, SGST, and IGST auto-calculated.', color: 'text-blue-600 bg-blue-50' },
              { icon: Users, title: 'Client Management', desc: 'Save your clients once. Pick them from a list next time. Their GSTIN and address auto-fill instantly.', color: 'text-purple-600 bg-purple-50' },
              { icon: Download, title: 'Instant PDF Download', desc: 'Download professional-looking invoices as PDF with one click. Share via WhatsApp, email, or print.', color: 'text-green-600 bg-green-50' },
              { icon: TrendingUp, title: 'Revenue Dashboard', desc: 'See how much you\'ve billed this month, which invoices are unpaid, and your top clients at a glance.', color: 'text-orange-600 bg-orange-50' },
              { icon: Shield, title: 'Secure & Private', desc: 'Your financial data is encrypted and stored securely. Only you can see your invoices. No data sharing.', color: 'text-red-600 bg-red-50' },
              { icon: CheckCircle, title: 'Track Invoice Status', desc: 'Mark invoices as Sent, Paid, or Overdue. Know exactly who owes you money without chasing spreadsheets.', color: 'text-teal-600 bg-teal-50' },
            ].map((f, index) => (
              <ScrollReveal key={f.title} delay={(index % 3) * 90}>
                <div className="card p-6 h-full">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${f.color}`}>
                    <f.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section id="pricing" className="py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <ScrollReveal direction="down">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple, honest pricing in ₹</h2>
            <p className="text-gray-500 mb-8">Start free. Upgrade when you need more.</p>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { name: 'Free', price: '₹0', desc: '5 invoices/month', cta: 'Get started', href: '/auth/signup', highlight: false },
              { name: 'Starter', price: '₹199/mo', desc: 'Unlimited invoices', cta: 'Start Starter', href: '/pricing', highlight: true },
              { name: 'Pro', price: '₹399/mo', desc: 'Unlimited everything', cta: 'Go Pro', href: '/pricing', highlight: false },
            ].map((p, index) => (
              <ScrollReveal key={p.name} delay={index * 90}>
                <div className={`card p-6 h-full ${p.highlight ? 'ring-2 ring-blue-500' : ''}`}>
                  {p.highlight && <div className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-2">Most Popular</div>}
                  <div className="font-bold text-xl text-gray-900 mb-1">{p.name}</div>
                  <div className="text-2xl font-extrabold text-gray-900 mb-2">{p.price}</div>
                  <div className="text-sm text-gray-500 mb-4">{p.desc}</div>
                  <Link href={p.href} className={p.highlight ? 'btn-primary w-full justify-center text-sm py-2' : 'btn-secondary w-full justify-center text-sm py-2'}>
                    {p.cta}
                  </Link>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-white mb-4">Start billing professionally today</h2>
            <p className="text-blue-100 mb-8">Join thousands of Indian freelancers and small businesses using BillBook.in</p>
            <Link href="/auth/signup" className="bg-white text-blue-600 font-bold px-8 py-3.5 rounded-lg inline-flex items-center gap-2 hover:bg-blue-50 transition-colors">
              Create free account <ArrowRight className="w-5 h-5" />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white py-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">BillBook.in</span>
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/pricing" className="hover:text-gray-900">Pricing</Link>
            <Link href="/auth/signup" className="hover:text-gray-900">Sign up</Link>
          </div>
          <p className="text-sm text-gray-400">© 2025 BillBook.in · Made in India 🇮🇳</p>
        </div>
      </footer>
    </div>
  )
}
