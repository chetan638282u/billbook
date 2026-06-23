export default function AuthVideoPanel() {
  return (
    <aside className="hidden min-h-screen items-center justify-center px-8 py-10 lg:flex">
      <div className="w-full max-w-3xl">
        <div className="mb-6 max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">BillBook workspace</p>
          <h2 className="mt-3 text-4xl font-bold leading-tight text-gray-950">
            Create, share and track invoices from one clean dashboard.
          </h2>
          <p className="mt-3 text-base leading-7 text-gray-600">
            A professional billing flow for GST invoices, PDF sharing, payment status and customer records.
          </p>
        </div>

        <div className="rounded-[2rem] border border-white/70 bg-white/75 p-4 shadow-2xl shadow-blue-950/10 backdrop-blur">
          <video
            className="aspect-video w-full rounded-[1.35rem] bg-white object-cover"
            src="/videos/billbook-auth-promo.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
          />
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          {['GST invoices', 'PDF download', 'Payment tracking', 'WhatsApp sharing'].map((item) => (
            <span key={item} className="rounded-full border border-blue-100 bg-white/80 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm">
              {item}
            </span>
          ))}
        </div>
      </div>
    </aside>
  )
}
