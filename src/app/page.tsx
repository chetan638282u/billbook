'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import {
  ArrowRight,
  BarChart3,
  Briefcase,
  Calculator,
  CheckCircle,
  CreditCard,
  Download,
  FileText,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ReceiptText,
  Shield,
  ShoppingBag,
  Star,
  Store,
  Users,
  Zap,
} from 'lucide-react'
import ScrollReveal from '@/components/ui/ScrollReveal'

export default function LandingPage() {
  const router = useRouter()

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const code = searchParams.get('code')
    if (!code) return

    const callbackParams = new URLSearchParams({ code })
    const next = searchParams.get('next')
    if (next?.startsWith('/')) callbackParams.set('next', next)
    router.replace(`/auth/callback?${callbackParams.toString()}`)
  }, [router])

  const features = [
    { icon: ReceiptText, title: 'GST & non-GST invoicing', desc: 'Create sharp invoices with GSTIN, HSN/SAC, CGST, SGST and IGST details arranged professionally.', color: 'bg-blue-50 text-blue-700' },
    { icon: Users, title: 'Client management', desc: 'Save party details once, reuse GST data, and bill repeat buyers without typing the same information again.', color: 'bg-emerald-50 text-emerald-700' },
    { icon: CreditCard, title: 'Payment tracking', desc: 'See paid, sent and overdue invoices clearly so you always know what is pending.', color: 'bg-amber-50 text-amber-700' },
    { icon: BarChart3, title: 'Business dashboard', desc: 'Track monthly invoices, paid revenue, unpaid amounts and top clients from one clean screen.', color: 'bg-violet-50 text-violet-700' },
    { icon: Download, title: 'PDF download', desc: 'Share buyer-ready invoices on WhatsApp, email, print or download as PDF whenever needed.', color: 'bg-cyan-50 text-cyan-700' },
    { icon: Shield, title: 'Secure records', desc: 'Business, client and invoice records stay private with protected user access.', color: 'bg-rose-50 text-rose-700' },
  ]

  const industries = [
    { icon: Briefcase, title: 'Freelancers', desc: 'Send polished invoices for design, marketing, tech, writing and consulting work.' },
    { icon: Store, title: 'Service shops', desc: 'Create bills quickly for repairs, services, subscriptions and local business work.' },
    { icon: ShoppingBag, title: 'Retail sellers', desc: 'Maintain customer records and create clean GST bills for repeat buyers.' },
    { icon: Users, title: 'Agencies', desc: 'Handle multiple clients, recurring projects and professional PDF invoices.' },
  ]

  const templates = [
    { name: 'Modern GST invoice', accent: 'bg-blue-600', meta: 'Best for consultants' },
    { name: 'Clean service bill', accent: 'bg-emerald-600', meta: 'Best for freelancers' },
    { name: 'Premium client invoice', accent: 'bg-violet-600', meta: 'Best for agencies' },
    { name: 'Compact print format', accent: 'bg-gray-900', meta: 'Best for quick billing' },
  ]

  const gstItems = [
    'GSTIN on business and client profile',
    'HSN/SAC ready line items',
    'CGST, SGST and IGST calculation',
    'Professional PDF-ready invoice layout',
  ]

  const faqs = [
    ['Can I create GST invoices?', 'Yes. BillBook.in is built around GST-ready invoice fields and tax calculations for Indian businesses.'],
    ['Can I use it without coding knowledge?', 'Yes. The app is designed for normal business owners, freelancers and teams who just want simple billing.'],
    ['Can I download invoices as PDF?', 'Yes. You can open an invoice and use the print or PDF flow to save and share it.'],
    ['Is there a free plan?', 'Yes. You can start free and upgrade only when your billing volume grows.'],
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
          50% { transform: translateY(-14px); }
        }
        @keyframes shine {
          0% { transform: translateX(-130%) rotate(8deg); opacity: 0; }
          18% { opacity: .5; }
          100% { transform: translateX(170%) rotate(8deg); opacity: 0; }
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

      <div className="bg-blue-700 px-4 py-2 text-center text-sm font-semibold text-white">
        Launch offer: Start free today and upgrade only when your billing grows.
      </div>

      <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/92 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 shadow-lg shadow-blue-200">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">BillBook<span className="text-blue-600">.in</span></span>
          </Link>
          <div className="hidden items-center gap-6 text-sm font-medium text-gray-600 lg:flex">
            <Link href="#features" className="transition-colors hover:text-blue-600">Features</Link>
            <Link href="#templates" className="transition-colors hover:text-blue-600">Templates</Link>
            <Link href="#industries" className="transition-colors hover:text-blue-600">Industries</Link>
            <Link href="#gst" className="transition-colors hover:text-blue-600">GST Tools</Link>
            <Link href="#pricing" className="transition-colors hover:text-blue-600">Pricing</Link>
            <Link href="#contact" className="transition-colors hover:text-blue-600">Get in touch</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/signin" className="text-sm font-medium text-gray-600 hover:text-gray-900">Login</Link>
            <Link href="/auth/signup" className="btn-primary text-sm py-2">Sign up free</Link>
          </div>
        </div>
      </nav>

      <section className="relative bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)]">
        <div className="mx-auto max-w-7xl px-4 py-16 lg:py-24">
          <ScrollReveal direction="down">
            <div className="mx-auto max-w-7xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm">
                <Zap className="h-4 w-4" />
                Create GST bill in 60 seconds
              </div>
              <h1 className="mx-auto max-w-7xl text-4xl font-extrabold leading-[1.08] tracking-normal text-gray-950 md:text-5xl lg:text-6xl">
                Create professional GST invoices, download PDFs, and share with customers in seconds.
              </h1>
              <p className="mx-auto mt-6 max-w-4xl text-xl leading-8 text-gray-600">
                Create GST invoices, manage clients, track payments and share polished PDFs from one premium billing workspace.
              </p>
              <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row sm:items-center">
                <Link href="/auth/signup" className="btn-primary bb-pulse justify-center px-8 py-3.5 text-base">
                  Sign up for free
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link href="#contact" className="btn-secondary justify-center px-8 py-3.5 text-base">
                  Get in touch
                  <MessageCircle className="h-5 w-5" />
                </Link>
              </div>
              <div className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-3">
                {[
                  ['60 sec', 'GST invoice'],
                  ['97%', 'clear tracking'],
                  ['500+', 'businesses'],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                    <div className="text-2xl font-extrabold text-gray-950">{value}</div>
                    <div className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-400">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

        </div>
      </section>

      <section className="border-y border-gray-100 bg-white py-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-4 px-4 text-sm font-semibold text-gray-500">
          <span className="flex items-center gap-2"><Shield className="h-4 w-4 text-emerald-500" /> Bank-grade encryption</span>
          <span className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> GST-compliant format</span>
          <span className="flex items-center gap-2"><Star className="h-4 w-4 fill-yellow-400 text-yellow-400" /> Trusted by 500+ businesses</span>
          <span className="flex items-center gap-2"><Download className="h-4 w-4 text-blue-500" /> Instant PDF download</span>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-[0.82fr_1.18fr]">
          <ScrollReveal>
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-blue-600">Live product preview</p>
              <h2 className="mt-3 text-4xl font-extrabold text-gray-950">See your billing business at a glance.</h2>
              <p className="mt-5 text-lg leading-8 text-gray-600">
                Keep the homepage focused, then show buyers the real product feeling: dashboard, invoice status, payment tracking and mobile sharing in one clean view.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {[
                  'Know paid and pending revenue',
                  'Track every invoice status',
                  'Download professional PDFs',
                  'Share invoice links from mobile',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                    <span className="text-sm font-semibold text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={120}>
            <div className="relative min-h-[590px]">
              <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-blue-100 blur-3xl" />
              <div className="bb-float bb-shine absolute right-0 top-8 w-full max-w-[610px] rounded-[1.75rem] border border-gray-200 bg-white p-4 shadow-2xl shadow-blue-200/60">
                <div className="rounded-[1.25rem] border border-gray-100 bg-gray-50">
                  <div className="flex items-center justify-between border-b border-gray-200 bg-white px-5 py-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Business dashboard</p>
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
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-white p-4 shadow-sm">
                        <p className="text-xs text-gray-400">Next action</p>
                        <p className="mt-1 font-bold text-gray-900">Send reminder</p>
                      </div>
                      <div className="rounded-xl bg-white p-4 shadow-sm">
                        <p className="text-xs text-gray-400">PDF status</p>
                        <p className="mt-1 font-bold text-emerald-600">Ready</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bb-float-slow absolute bottom-0 left-0 w-[250px] rounded-[2.1rem] border-[8px] border-gray-950 bg-gray-950 shadow-2xl shadow-gray-300">
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

              <div className="absolute right-10 top-1 hidden rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm font-semibold text-emerald-700 shadow-xl md:block">
                <Calculator className="mr-2 inline h-4 w-4" />
                Auto GST calculated
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section id="templates" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4">
          <ScrollReveal direction="down">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <p className="text-sm font-bold uppercase tracking-wide text-blue-600">Invoice templates</p>
              <h2 className="mt-3 text-4xl font-extrabold text-gray-950">Create customised bills with a professional look.</h2>
              <p className="mt-4 text-lg text-gray-600">Give your invoices the trust factor buyers expect from serious businesses.</p>
            </div>
          </ScrollReveal>
          <div className="grid gap-5 md:grid-cols-4">
            {templates.map((template, index) => (
              <ScrollReveal key={template.name} delay={index * 70}>
                <div className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-100">
                  <div className={`${template.accent} h-2`} />
                  <div className="p-5">
                    <div className="mb-5 rounded-xl bg-gray-50 p-4">
                      <div className="mb-3 flex justify-between">
                        <div className="h-3 w-20 rounded-full bg-gray-300" />
                        <div className="h-3 w-10 rounded-full bg-gray-200" />
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 rounded-full bg-gray-200" />
                        <div className="h-2 w-4/5 rounded-full bg-gray-200" />
                        <div className="h-2 w-2/3 rounded-full bg-gray-200" />
                      </div>
                      <div className="mt-5 grid grid-cols-3 gap-2">
                        <div className="h-8 rounded-lg bg-white" />
                        <div className="h-8 rounded-lg bg-white" />
                        <div className="h-8 rounded-lg bg-white" />
                      </div>
                    </div>
                    <h3 className="font-bold text-gray-950">{template.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">{template.meta}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <ScrollReveal direction="down">
            <div className="mx-auto mb-14 max-w-3xl text-center">
              <p className="text-sm font-bold uppercase tracking-wide text-blue-600">Why BillBook.in</p>
              <h2 className="mt-3 text-4xl font-extrabold text-gray-950">Everything you need to bill professionally.</h2>
              <p className="mt-4 text-lg text-gray-600">Inspired by serious billing platforms, built simpler for freelancers and small teams.</p>
            </div>
          </ScrollReveal>
          <div className="grid gap-5 md:grid-cols-3">
            {features.map((feature, index) => (
              <ScrollReveal key={feature.title} delay={(index % 3) * 80}>
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

      <section id="gst" className="bg-white py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-[0.9fr_1.1fr]">
          <ScrollReveal>
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-blue-600">Stay GST ready</p>
              <h2 className="mt-3 text-4xl font-extrabold text-gray-950">Invoices that are easy for buyers and accountants to understand.</h2>
              <p className="mt-5 text-lg leading-8 text-gray-600">Keep tax-ready details visible, calculate totals clearly and share invoices that do not look homemade.</p>
              <div className="mt-8 grid gap-3">
                {gstItems.map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                    <span className="font-medium text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <div className="overflow-hidden rounded-[2rem] border border-gray-100 bg-gray-950 p-3 shadow-2xl shadow-gray-300">
              <div className="rounded-[1.5rem] bg-white p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">GST invoice</p>
                    <p className="text-xl font-extrabold text-gray-950">INV-2026-0042</p>
                  </div>
                  <div className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">PDF ready</div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-gray-400">From</p>
                    <p className="mt-2 font-bold text-gray-950">Rahul Sharma Studio</p>
                    <p className="text-sm text-gray-500">GSTIN: 07AABCU9603R1ZX</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-gray-400">To</p>
                    <p className="mt-2 font-bold text-gray-950">TechCorp Pvt. Ltd.</p>
                    <p className="text-sm text-gray-500">Mumbai, Maharashtra</p>
                  </div>
                </div>
                <div className="mt-5 space-y-3">
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

      <section id="industries" className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <ScrollReveal direction="down">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <p className="text-sm font-bold uppercase tracking-wide text-blue-600">Used across sectors</p>
              <h2 className="mt-3 text-4xl font-extrabold text-gray-950">Built for the way Indian businesses actually bill.</h2>
            </div>
          </ScrollReveal>
          <div className="grid gap-5 md:grid-cols-4">
            {industries.map((industry, index) => (
              <ScrollReveal key={industry.title} delay={index * 70}>
                <div className="h-full rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <industry.icon className="mb-5 h-8 w-8 text-blue-600" />
                  <h3 className="text-lg font-bold text-gray-950">{industry.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-gray-500">{industry.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 lg:grid-cols-[1fr_0.9fr]">
          <ScrollReveal>
            <div className="overflow-hidden rounded-[2rem] border border-gray-100 bg-white p-5 shadow-2xl shadow-blue-100">
              <div className="rounded-[1.5rem] bg-gradient-to-br from-blue-50 via-white to-emerald-50 p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white p-5 shadow-sm">
                    <div className="mb-5 flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                        <Store className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Business</p>
                        <p className="font-bold text-gray-950">Sharma Services</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between rounded-xl bg-gray-50 px-4 py-3 text-sm"><span className="text-gray-500">Today billed</span><span className="font-bold">₹42,800</span></div>
                      <div className="flex justify-between rounded-xl bg-gray-50 px-4 py-3 text-sm"><span className="text-gray-500">Invoices sent</span><span className="font-bold">12</span></div>
                      <div className="flex justify-between rounded-xl bg-gray-50 px-4 py-3 text-sm"><span className="text-gray-500">Pending dues</span><span className="font-bold text-orange-600">₹9,400</span></div>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-gray-950 p-5 text-white shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-wide text-blue-200">Mobile view</p>
                    <div className="mt-5 rounded-2xl bg-white p-4 text-gray-950">
                      <p className="text-xs text-gray-400">Invoice ready</p>
                      <p className="mt-1 text-3xl font-extrabold">₹18,600</p>
                      <div className="mt-4 h-2 rounded-full bg-gray-100"><div className="h-2 w-3/4 rounded-full bg-emerald-500" /></div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-xl bg-white/10 p-3">PDF</div>
                      <div className="rounded-xl bg-white/10 p-3">WhatsApp</div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 rounded-2xl bg-white p-5 shadow-sm">
                  <p className="font-bold text-gray-950">Run billing from your desk, shop counter or client meeting.</p>
                  <p className="mt-2 text-sm leading-6 text-gray-500">The page feels visual without depending on stock photos or external image loading.</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-blue-600">Run your business anywhere</p>
              <h2 className="mt-3 text-4xl font-extrabold text-gray-950">Your invoice desk stays with you.</h2>
              <p className="mt-5 text-lg leading-8 text-gray-600">Create invoices from your laptop, review client details, download PDFs and keep billing moving even when you are not at your desk.</p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {['Works on web', 'Fast invoice sharing', 'Client records saved', 'Dashboard visibility'].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                    <span className="text-sm font-semibold text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section id="pricing" className="bg-gray-50 py-20">
        <div className="mx-auto max-w-5xl px-4">
          <ScrollReveal direction="down">
            <div className="mx-auto mb-12 max-w-3xl text-center">
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

      <section className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-4">
          <ScrollReveal direction="down">
            <div className="mb-10 text-center">
              <p className="text-sm font-bold uppercase tracking-wide text-blue-600">FAQ</p>
              <h2 className="mt-3 text-4xl font-extrabold text-gray-950">Quick answers before you start.</h2>
            </div>
          </ScrollReveal>
          <div className="grid gap-4">
            {faqs.map(([question, answer], index) => (
              <ScrollReveal key={question} delay={index * 60}>
                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                  <h3 className="font-bold text-gray-950">{question}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{answer}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="bg-blue-700 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <ScrollReveal direction="down">
            <div className="mx-auto mb-10 max-w-3xl text-center">
              <p className="text-sm font-bold uppercase tracking-wide text-blue-100">Get in touch</p>
              <h2 className="mt-3 text-4xl font-extrabold text-white">Need help choosing the right billing setup?</h2>
              <p className="mt-4 text-lg text-blue-100">Reach out and we will help you start billing professionally.</p>
            </div>
          </ScrollReveal>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              { icon: Phone, title: 'Phone / WhatsApp', detail: '+91 74004 17400' },
              { icon: Mail, title: 'Email', detail: 'support@billbook.in' },
              { icon: MapPin, title: 'Office', detail: 'Built for businesses across India' },
            ].map((item, index) => (
              <ScrollReveal key={item.title} delay={index * 80}>
                <div className="rounded-2xl border border-white/15 bg-white p-6 shadow-xl shadow-blue-900/20">
                  <item.icon className="mb-5 h-8 w-8 text-blue-600" />
                  <h3 className="text-lg font-bold text-gray-950">{item.title}</h3>
                  <p className="mt-2 text-sm font-medium text-gray-600">{item.detail}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-gray-950 py-14 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">BillBook.in</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-6 text-gray-400">
              GST billing, client records and professional invoice sharing for Indian freelancers and small businesses.
            </p>
            <p className="mt-6 text-sm text-gray-500">© 2025 BillBook.in. Made in India.</p>
          </div>
          <div>
            <h3 className="font-bold">Product</h3>
            <div className="mt-4 grid gap-3 text-sm text-gray-400">
              <Link href="#features" className="hover:text-white">Features</Link>
              <Link href="#templates" className="hover:text-white">Templates</Link>
              <Link href="#pricing" className="hover:text-white">Pricing</Link>
              <Link href="/auth/signup" className="hover:text-white">Sign up</Link>
            </div>
          </div>
          <div>
            <h3 className="font-bold">Resources</h3>
            <div className="mt-4 grid gap-3 text-sm text-gray-400">
              <Link href="#gst" className="hover:text-white">GST Tools</Link>
              <Link href="#industries" className="hover:text-white">Industries</Link>
              <Link href="#contact" className="hover:text-white">Support</Link>
              <Link href="#features" className="hover:text-white">Knowledge</Link>
            </div>
          </div>
          <div>
            <h3 className="font-bold">Contact</h3>
            <div className="mt-4 grid gap-3 text-sm text-gray-400">
              <span>+91 74004 17400</span>
              <span>support@billbook.in</span>
              <span>India</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
