export default function AuthVideoPanel() {
  return (
    <aside className="hidden min-h-screen items-center justify-center bg-[#f5f7fb] p-8 lg:flex">
      <video
        className="h-full max-h-[760px] w-full max-w-4xl rounded-2xl object-contain shadow-2xl shadow-blue-950/15"
        src="/videos/billbook-auth-promo.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
      />
    </aside>
  )
}
