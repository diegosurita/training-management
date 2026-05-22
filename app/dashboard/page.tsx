export default function DashboardPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.96),_rgba(244,244,245,0.9)_45%,_rgba(228,228,231,0.88))] px-4 py-12 dark:bg-[radial-gradient(circle_at_top,_rgba(24,24,27,0.96),_rgba(9,9,11,0.96)_55%,_rgba(0,0,0,1))]">
      <section className="w-full max-w-md rounded-2xl border border-zinc-200/80 bg-white/90 p-8 text-center shadow-[0_24px_80px_-36px_rgba(0,0,0,0.35)] backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/85">
        <p className="text-xs font-medium uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
          Authenticated
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          You are signed in.
        </p>
      </section>
    </main>
  )
}