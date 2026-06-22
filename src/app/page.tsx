import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  ArrowRight,
  BarChart3,
  Calculator,
  CheckCircle,
  Download,
  FileText,
  Shield,
  Star,
  Users,
  Zap,
} from 'lucide-react'
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

  const featureCards = [
    { icon: FileText, title: 'GST-ready invoices', desc: 'GSTIN, HSN/SAC, CGST, SGST and IGST fields are arranged in a clean professional format.', color: 'text-blue-600 bg-blue-50' },
    { icon: Users, title: 'Client memory', desc: 'Save clients once and reuse their billing details every time without hunting through spreadsheets.', color: 'text-violet-600 bg-violet-50' },
    { icon: Calculator, title: 'Automatic tax math', desc: 'Totals, GST split, subtotal and payable amount update instantly as you build the invoice.', color: 'text-emerald-600 bg-emerald-50' },
    { icon: BarChart3, title: 'Revenue dashboard', desc: 'Track paid revenue, unpaid invoices, monthly usage and client activity from one place.', color: 'text-orange-600 bg-orange-50' },
    { icon: Download, title: 'PDF-ready output', desc: 'Create a sharp invoice your buyer can download, print, share on WhatsApp or send by email.', color: 'text-cyan-600 bg-cyan-50' },
    { icon: Shield, title: 'Private by design', desc: 'Every user sees only their own business, client and invoice records with secure access rules.', color: 'text-rose-600 bg-rose-50' },
  ]

  const workflow = [
    { step: '01', title: 'Add your client', desc: 'Pick an existing client or create a new GST profile in seconds.' },
    { step: '02', title: 'Enter line items', desc: 'Add services, HSN/SAC, quantity, rate and GST percentage.' },
    { step: '03', title: 'Share the invoice', desc: 'Send a polished invoice link or download the PDF for your buyer.' },
  ]

  const plans = [
    { name: 'Free', price: '₹0', desc: '5 invoices/month', cta: 'Get started', href: '/auth/signup', highlight: false },
    { name: 'Starter', price: '₹199/mo', desc: 'Unlimited invoices', cta: 'Start Starter', href: '/pricing', highlight: true },
    { name: 'Pro', price: '₹399/mo', desc: 'Unlimited everything', cta: 'Go Pro', href: '/pricing', highlight: false },
  ]

  return (
    <div className="min-h-screen overflow-hidden bg-white text-gray-950">
      <style>{`
        html { scroll-behavior: smooth; }
        @keyframes float-soft {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-16px); }
        }
        @keyframes shine {
          0% { transform: translateX(-120%) rotate(8deg); opacity: 0; }
          20% { opacity: .45; }
          100% { transform: translateX(160%) rotate(8deg); opacity: 0; }
        }
        @keyframes pulse-ring {
          0%, 100% { box-shadow: 0 0 0 0 rgb(37 99 235 / .18); }
          50% { box-shadow: 0 0 0 18px rgb(37 99 235 / 0); }
        }
        .bb-float { animation: float-soft 6s ease-in-out infinite; }
        .bb-float-slow { animation: float-soft 8s ease-in-out infinite; }
        .bb-shine { position: relative; overflow: hidden; }
        .bb-shine::after {
          content: "";
          position: absolute;
          inset: -40% auto -40% -30%;
          width: 42%;
          background: linear-gradient(90deg, transparent, rgb(255 255 255 / .8), transparent);
          animation: shine 5.4s ease-in-out infinite;
        }
        .bb-pulse { animation: pulse-ring 2.8s ease-in-out infinite; }
      `}</style>

      <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 shadow-lg shadow-blue-200">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">BillBook<span className="text-blue-600">.in</span></span>
            </Link>
            <div className="hidden items-center gap-6 text-sm font-medium text-gray-600 md:flex">
              <Link href="#features" className="transition-colors hover:text-blue-600">Features</Link>
              <Link href="#workflow" className="transition-colors hover:text-blue-600">Knowledge</Link>
              <Link href="#pricing" className="transition-colors hover:text-blue-600">Pricing</Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/signin" className="text-sm font-medium text-gray-600 hover:text-gray-900">Sign in</Link>
            <Link href="/auth/signup" className="btn-primary text-sm py-2">Start Free</Link>
          </div>
        </div>
      </nav>

      <section className="relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#dbeafe,transparent_28%),radial-gradient(circle_at_80%_10%,#dcfce7,transparent_24%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 lg:grid-cols-[1fr_0.95fr] lg:py-24">
          <ScrollReveal direction="down">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm">
                <Shield className="h-4 w-4" />
                GST billing built for Indian businesses
              </div>
              <h1 className="max-w-3xl text-5xl font-extrabold leading-tight tracking-normal text-gray-950 md:text-6xl">
                Create invoices that make your business look bigger.
              </h1>
              <p className="mt-6 max-w-2xl text-xl leading-8 text-gray-600">
                BillBook.in turns billing, GST calculations, client records and invoice sharing into a premium workflow your customers can trust.
              </p>
              <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link href="/auth/signup" className="btn-primary bb-pulse justify-center px-8 py-3.5 text-base">
                  Create your first invoice free
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  No credit card required
                </div>
              </div>
              <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
                {[
                  ['60 sec', 'invoice setup'],
                  ['500+', 'businesses'],
                  ['100%', 'GST-ready'],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-xl border border-gray-100 bg-white/80 p-4 shadow-sm">
                    <div className="text-2xl font-extrabold text-gray-950">{value}</div>
                    <div className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-400">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={120}>
            <div className="relative min-h-[560px]">
              <div className="bb-float bb-shine absolute right-0 top-6 w-full max-w-[530px] rounded-[1.75rem] border border-gray-200 bg-white p-4 shadow-2xl shadow-blue-200/60">
                <div className="rounded-[1.25rem] border border-gray-100 bg-gray-50">
                  <div className="flex items-center justify-between border-b border-gray-200 bg-white px-5 py-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Dashboard</p>
                      <p className="text-lg font-bold text-gray-900">June billing overview</p>
                    </div>
                    <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">Live</div>
                  </div>
                  <div className="grid gap-3 p-5 sm:grid-cols-3">
                    {[
                      ['Paid', '₹1.84L', 'text-emerald-600'],
                      ['Pending', '₹42K', 'text-orange-600'],
                      ['Clients', '28', 'text-blue-600'],
                    ].map(([label, value, color]) => (
                      <div key={label} className="rounded-xl bg-white p-4 shadow-sm">
                        <p className="text-xs font-medium text-gray-400">{label}</p>
                        <p className={`mt-2 text-2xl font-extrabold ${color}`}>{value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="px-5 pb-5">
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                      <div className="mb-4 flex items-center justify-between">
                        <p className="font-semibold text-gray-900">Recent invoice</p>
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">Sent</span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm"><span className="text-gray-500">TechCorp Pvt. Ltd.</span><span className="font-semibold">₹59,000</span></div>
                        <div className="h-2 rounded-full bg-gray-100"><div className="h-2 w-4/5 rounded-full bg-blue-600" /></div>
                        <div className="grid grid-cols-3 gap-2 text-xs text-gray-500">
                          <span>CGST ₹4,500</span>
                          <span>SGST ₹4,500</span>
                          <span>Total ₹59,000</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bb-float-slow absolute bottom-0 left-0 w-[245px] rounded-[2.1rem] border-[8px] border-gray-950 bg-gray-950 shadow-2xl shadow-gray-300">
                <div className="rounded-[1.55rem] bg-white p-4">
                  <div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-gray-900" />
                  <div className="rounded-2xl bg-blue-600 p-4 text-white">
                    <p className="text-xs text-blue-100">Invoice ready</p>
                    <p className="mt-1 text-2xl font-extrabold">₹59,000</p>
                  </div>
                  <div className="mt-4 space-y-3">
                    <div className="rounded-xl border border-gray-100 p-3">
                      <p className="text-xs text-gray-400">Client</p>
                      <p className="font-semibold text-gray-900">TechCorp</p>
                    </div>
                    <div className="rounded-xl border border-gray-100 p-3">
                      <p className="text-xs text-gray-400">Status</p>
                      <p className="font-semibold text-emerald-600">Shared</p>
                    </div>
                    <Link href="/auth/signup" className="flex items-center justify-center gap-2 rounded-xl bg-gray-950 px-4 py-3 text-sm font-bold text-white">
                      Send invoice <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>

              <div className="absolute right-8 top-0 hidden rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm font-semibold text-emerald-700 shadow-xl md:block">
                <Zap className="mr-2 inline h-4 w-4" />
                Auto GST calculated
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="border-y border-gray-100 bg-white py-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-4 px-4 text-sm font-semibold text-gray-500">
          <span className="flex items-center gap-2"><Shield className="h-4 w-4 text-emerald-500" /> Bank-grade encryption</span>
          <span className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> GST-compliant format</span>
          <span className="flex items-center gap-2"><Star className="h-4 w-4 fill-yellow-400 text-yellow-400" /> Trusted by 500+ businesses</span>
          <span className="flex items-center gap-2"><Download className="h-4 w-4 text-blue-500" /> Instant PDF download</span>
        </div>
      </section>

      <section id="features" className="bg-gray-50 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <ScrollReveal direction="down">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <p className="text-sm font-bold uppercase tracking-wide text-blue-600">Everything a buyer expects</p>
              <h2 className="mt-3 text-4xl font-extrabold text-gray-950">A polished billing system, not another spreadsheet.</h2>
              <p className="mt-4 text-lg text-gray-600">Every section is designed to help your customer feel they are paying a serious, organized business.</p>
            </div>
          </ScrollReveal>
          <div className="grid gap-5 md:grid-cols-3">
            {featureCards.map((feature, index) => (
              <ScrollReveal key={feature.title} delay={(index % 3) * 90}>
                <div className="group h-full rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-100">
                  <div className={`mb-5 flex h-11 w-11 items-center justify-center rounded-xl ${feature.color}`}>
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-950">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-gray-500">{feature.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section id="workflow" className="bg-white py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 lg:grid-cols-[0.9fr_1.1fr]">
          <ScrollReveal>
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-blue-600">How it works</p>
              <h2 className="mt-3 text-4xl font-extrabold text-gray-950">From client request to professional invoice in three steps.</h2>
              <p className="mt-5 text-lg leading-8 text-gray-600">BillBook keeps the workflow simple enough for busy owners and polished enough for serious buyers.</p>
              <div className="mt-8 space-y-4">
                {workflow.map((item) => (
                  <div key={item.step} className="flex gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-sm font-extrabold text-white">{item.step}</div>
                    <div>
                      <h3 className="font-bold text-gray-950">{item.title}</h3>
                      <p className="mt-1 text-sm text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <div className="rounded-[2rem] border border-gray-100 bg-gray-950 p-3 shadow-2xl shadow-gray-300">
              <div className="rounded-[1.5rem] bg-white p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Invoice builder</p>
                    <p className="text-xl font-extrabold text-gray-950">New GST invoice</p>
                  </div>
                  <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">Balanced</div>
                </div>
                <div className="space-y-3">
                  {[
                    ['Website design', '₹50,000'],
                    ['CGST 9%', '₹4,500'],
                    ['SGST 9%', '₹4,500'],
                  ].map(([label, amount]) => (
                    <div key={label} className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3">
                      <span className="text-sm font-medium text-gray-600">{label}</span>
                      <span className="font-bold text-gray-950">{amount}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 rounded-2xl bg-blue-600 p-5 text-white">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-blue-100">Total payable</span>
                    <span className="text-3xl font-extrabold">₹59,000</span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <ScrollReveal direction="down">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <p className="text-sm font-bold uppercase tracking-wide text-blue-600">Built for India</p>
              <h2 className="mt-3 text-4xl font-extrabold text-gray-950">The details your buyers and accountants care about.</h2>
            </div>
          </ScrollReveal>
          <div className="grid gap-5 md:grid-cols-4">
            {[
              ['GSTIN fields', 'Business and client GST details stay visible.'],
              ['HSN/SAC codes', 'Add the codes buyers expect on invoices.'],
              ['Status tracking', 'Draft, sent, paid and overdue are clear.'],
              ['Client records', 'Repeat billing becomes faster each month.'],
            ].map(([title, desc], index) => (
              <ScrollReveal key={title} delay={index * 70}>
                <div className="h-full rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <CheckCircle className="mb-4 h-5 w-5 text-emerald-500" />
                  <h3 className="font-bold text-gray-950">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-500">{desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-4">
          <ScrollReveal direction="down">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <p className="text-sm font-bold uppercase tracking-wide text-blue-600">Simple pricing</p>
              <h2 className="mt-3 text-4xl font-extrabold text-gray-950">Start free. Upgrade when billing becomes serious.</h2>
              <p className="mt-4 text-lg text-gray-600">Clear monthly plans with no complicated setup.</p>
            </div>
          </ScrollReveal>
          <div className="grid gap-5 md:grid-cols-3">
            {plans.map((plan, index) => (
              <ScrollReveal key={plan.name} delay={index * 90}>
                <div className={`relative h-full rounded-2xl border bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${plan.highlight ? 'border-blue-500 shadow-blue-100' : 'border-gray-100'}`}>
                  {plan.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wide text-white">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-xl font-extrabold text-gray-950">{plan.name}</h3>
                  <div className="mt-3 text-4xl font-extrabold text-gray-950">{plan.price}</div>
                  <p className="mt-2 text-sm text-gray-500">{plan.desc}</p>
                  <Link href={plan.href} className={plan.highlight ? 'btn-primary mt-6 w-full justify-center py-3' : 'btn-secondary mt-6 w-full justify-center py-3'}>
                    {plan.cta}
                  </Link>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-blue-600 py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 lg:grid-cols-[1fr_auto]">
          <ScrollReveal>
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-blue-100">Ready to look professional?</p>
              <h2 className="mt-3 max-w-3xl text-4xl font-extrabold text-white">Send your next invoice with the confidence of a real finance system.</h2>
              <p className="mt-4 max-w-2xl text-lg text-blue-100">Create your free account, add one client and see how fast polished GST billing can feel.</p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <Link href="/auth/signup" className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-8 py-3.5 font-bold text-blue-600 transition-colors hover:bg-blue-50">
              Create free account <ArrowRight className="h-5 w-5" />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      <footer className="border-t border-gray-100 bg-white py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600">
              <FileText className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">BillBook.in</span>
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="#pricing" className="hover:text-gray-900">Pricing</Link>
            <Link href="/auth/signup" className="hover:text-gray-900">Sign up</Link>
          </div>
          <p className="text-sm text-gray-400">© 2025 BillBook.in · Made in India</p>
        </div>
      </footer>
    </div>
  )
}
