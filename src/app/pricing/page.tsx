import Link from "next/link";
import BillingToggle from "./BillingToggle";

export const metadata = {
  title: "Pricing - My Font Preview",
  description:
    "Simple, transparent pricing for My Font Preview. Start free, upgrade when you need more power.",
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* ─── Background decoration ─── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-48 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-violet-600/5 blur-3xl" />
        <div className="absolute top-[60%] -right-64 w-[600px] h-[600px] rounded-full bg-fuchsia-600/5 blur-3xl" />
      </div>

      {/* ─── Navbar ─── */}
      <nav className="relative z-10 border-b border-zinc-800/60 backdrop-blur-md bg-zinc-950/60">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-white">
            My Font <span className="text-violet-500">Preview</span>
          </Link>
          <Link
            href="/login"
            className="text-sm bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* ─── Header ─── */}
      <section className="relative z-10 text-center px-6 pt-20 pb-4">
        <span className="inline-block text-xs font-semibold uppercase tracking-widest text-violet-400 bg-violet-500/10 px-3 py-1 rounded-full mb-6">
          Pricing
        </span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
          Simple, Transparent Pricing
        </h1>
        <p className="mt-4 text-lg text-zinc-400 max-w-xl mx-auto">
          Start free. Upgrade when you need more power.
        </p>
      </section>

      {/* ─── Client section (toggle + cards + table + FAQ + CTA) ─── */}
      <section className="relative z-10 pt-10 pb-24">
        <BillingToggle />
      </section>

      {/* ─── Footer ─── */}
      <footer className="relative z-10 mt-auto border-t border-zinc-800/60 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-zinc-500">
          &copy; {new Date().getFullYear()} My Font Preview. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
