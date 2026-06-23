export default function AuthVisualPanel() {
  return (
    <aside className="relative hidden min-h-screen overflow-hidden bg-[#08111f] lg:flex">
      <style>{`
        @keyframes auth-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-14px); }
        }
        @keyframes auth-drift {
          0%, 100% { transform: translate3d(0, 0, 0) rotate(0deg); }
          50% { transform: translate3d(18px, -16px, 0) rotate(5deg); }
        }
        @keyframes auth-bars {
          0%, 100% { transform: scaleY(.72); }
          50% { transform: scaleY(1); }
        }
        @keyframes auth-sheen {
          0% { transform: translateX(-120%); }
          54%, 100% { transform: translateX(180%); }
        }
        .auth-float { animation: auth-float 5.5s ease-in-out infinite; }
        .auth-drift { animation: auth-drift 7s ease-in-out infinite; }
        .auth-sheen::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(110deg, transparent 10%, rgb(255 255 255 / .18) 42%, transparent 70%);
          animation: auth-sheen 5.8s ease-in-out infinite;
        }
        .auth-bar { transform-origin: bottom; animation: auth-bars 2.8s ease-in-out infinite; }
      `}</style>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(45,212,191,.22),transparent_30%),radial-gradient(circle_at_78%_12%,rgba(59,130,246,.28),transparent_32%),radial-gradient(circle_at_64%_82%,rgba(16,185,129,.18),transparent_34%)]" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:44px_44px]" />

      <div className="relative mx-auto flex w-full max-w-3xl items-center justify-center px-10">
        <div className="relative h-[620px] w-full max-w-[660px]">
          <div className="auth-drift absolute left-8 top-16 h-24 w-24 rounded-full border border-cyan-300/30 bg-cyan-300/10 blur-[1px]" />
          <div className="auth-drift absolute bottom-24 right-8 h-28 w-28 rounded-full border border-blue-300/25 bg-blue-400/10 blur-[1px] [animation-delay:1.2s]" />

          <div className="auth-float absolute left-6 top-36 z-20 w-44 rounded-2xl border border-white/15 bg-white/95 p-4 shadow-2xl shadow-black/25">
            <div className="mb-3 flex items-center gap-2">
              <span className="h-9 w-9 rounded-xl bg-emerald-500" />
              <span className="h-3 w-20 rounded-full bg-gray-200" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full rounded-full bg-gray-100" />
              <div className="h-3 w-3/4 rounded-full bg-gray-100" />
              <div className="mt-4 h-8 rounded-xl bg-emerald-500" />
            </div>
          </div>

          <div className="auth-float absolute right-3 top-20 z-20 w-40 rounded-2xl border border-white/15 bg-white/95 p-4 shadow-2xl shadow-black/25 [animation-delay:.9s]">
            <div className="mb-3 h-9 w-9 rounded-xl bg-blue-600" />
            <div className="h-8 w-28 rounded-full bg-gray-900" />
            <div className="mt-3 grid grid-cols-3 gap-2">
              <span className="h-9 rounded-lg bg-blue-100" />
              <span className="h-9 rounded-lg bg-cyan-100" />
              <span className="h-9 rounded-lg bg-emerald-100" />
            </div>
          </div>

          <div className="absolute bottom-16 right-20 z-30 w-36 rounded-[2rem] border-[8px] border-gray-950 bg-white p-3 shadow-2xl shadow-black/40">
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-gray-900" />
            <div className="rounded-2xl bg-blue-600 p-3">
              <div className="h-3 w-16 rounded-full bg-white/45" />
              <div className="mt-3 h-8 w-24 rounded-full bg-white" />
            </div>
            <div className="mt-3 space-y-2">
              <div className="h-10 rounded-xl border border-gray-100 bg-gray-50" />
              <div className="h-10 rounded-xl border border-gray-100 bg-gray-50" />
            </div>
            <div className="mt-3 h-10 rounded-xl bg-gray-950" />
          </div>

          <div className="absolute left-16 top-28 z-10 w-[560px]">
            <div className="rounded-[2rem] border border-white/15 bg-gray-950 p-4 shadow-2xl shadow-black/50">
              <div className="auth-sheen relative overflow-hidden rounded-[1.35rem] bg-[#f8fbff] p-5">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-9 w-9 rounded-xl bg-blue-600" />
                    <span className="h-4 w-28 rounded-full bg-gray-200" />
                  </div>
                  <div className="flex gap-2">
                    <span className="h-8 w-8 rounded-full bg-emerald-100" />
                    <span className="h-8 w-8 rounded-full bg-blue-100" />
                    <span className="h-8 w-8 rounded-full bg-gray-200" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-2xl bg-blue-600 p-4 shadow-lg shadow-blue-200">
                    <div className="h-3 w-16 rounded-full bg-white/45" />
                    <div className="mt-4 h-8 w-24 rounded-full bg-white" />
                  </div>
                  <div className="rounded-2xl border border-gray-100 bg-white p-4">
                    <div className="h-3 w-20 rounded-full bg-gray-200" />
                    <div className="mt-4 h-8 w-24 rounded-full bg-emerald-200" />
                  </div>
                  <div className="rounded-2xl border border-gray-100 bg-white p-4">
                    <div className="h-3 w-20 rounded-full bg-gray-200" />
                    <div className="mt-4 h-8 w-24 rounded-full bg-amber-200" />
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-[1.1fr_.9fr] gap-4">
                  <div className="rounded-2xl border border-gray-100 bg-white p-4">
                    <div className="mb-4 flex h-36 items-end gap-3">
                      {[54, 82, 64, 98, 72, 110, 88].map((height, index) => (
                        <span
                          key={height}
                          className="auth-bar flex-1 rounded-t-xl bg-blue-500"
                          style={{ height, animationDelay: `${index * 140}ms` }}
                        />
                      ))}
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      <span className="h-3 rounded-full bg-gray-100" />
                      <span className="h-3 rounded-full bg-gray-100" />
                      <span className="h-3 rounded-full bg-gray-100" />
                      <span className="h-3 rounded-full bg-gray-100" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[0, 1, 2].map((item) => (
                      <div key={item} className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3">
                        <span className="h-11 w-11 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400" />
                        <span className="flex-1 space-y-2">
                          <span className="block h-3 rounded-full bg-gray-200" />
                          <span className="block h-3 w-2/3 rounded-full bg-gray-100" />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="mx-auto h-4 w-[78%] rounded-b-[2rem] bg-gray-800" />
            <div className="mx-auto h-3 w-[48%] rounded-b-full bg-gray-700" />
          </div>
        </div>
      </div>
    </aside>
  )
}
