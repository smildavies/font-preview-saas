"use client";

import { useState } from "react";
import Link from "next/link";

/* ────────── data ────────── */

interface Feature {
  name: string;
  free: boolean;
  pro: boolean;
  badge?: string; // "NEW" etc.
  detail?: string; // extra info shown in Pro card
}

const features: Feature[] = [
  { name: "Auto-detect installed fonts", free: true, pro: true },
  { name: "Live text preview", free: true, pro: true },
  { name: "Search & filter fonts", free: true, pro: true },
  { name: "Copy font name & CSS", free: true, pro: true },
  { name: "2 background presets", free: true, pro: true },
  { name: "List & grid views", free: true, pro: true },
  { name: "Mockup templates (6 designs)", free: false, pro: true, badge: "NEW" },
  { name: "AI font pairing suggestions", free: false, pro: true, badge: "NEW" },
  { name: "Brand kit builder", free: false, pro: true, badge: "NEW" },
  { name: "Client share links with voting", free: false, pro: true, badge: "NEW" },
  { name: "Similar fonts finder", free: false, pro: true, badge: "NEW" },
  { name: "Font Mixer (per-letter mixing)", free: false, pro: true, badge: "NEW" },
  { name: "Monogram Builder", free: false, pro: true, badge: "NEW" },
  { name: "Crafter Mockups (mugs, tumblers, signs)", free: false, pro: true, badge: "NEW" },
  { name: "SVG Export (Cricut / Silhouette)", free: false, pro: true, badge: "NEW" },
  { name: "Font Mood Finder (8 styles)", free: false, pro: true, badge: "NEW" },
  { name: "Wedding & Event Templates", free: false, pro: true, badge: "NEW" },
  { name: "Glyph explorer", free: false, pro: true },
  { name: "Side-by-side compare (6 fonts)", free: false, pro: true },
  { name: "Export previews as PNG", free: false, pro: true },
  { name: "Bold / italic / uppercase / underline", free: false, pro: true },
  { name: "Custom background colors", free: false, pro: true },
];

const freeFeatures = features.filter((f) => f.free);
const proOnlyFeatures = features.filter((f) => !f.free);

/* ────────── icons ────────── */

function Check({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`w-4 h-4 shrink-0 ${className}`}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.5}
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

function XMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`w-4 h-4 shrink-0 ${className}`}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.5}
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

/* ────────── component ────────── */

export default function BillingToggle() {
  const [annual, setAnnual] = useState(false);

  const proPrice = annual ? "$6" : "$8";
  const proPeriod = annual ? "/mo, billed yearly" : "/mo";

  return (
    <>
      {/* ─── Toggle ─── */}
      <div className="flex items-center justify-center gap-4 mb-16">
        <span
          className={`text-sm font-medium transition-colors ${
            !annual ? "text-white" : "text-zinc-500"
          }`}
        >
          Monthly
        </span>
        <button
          type="button"
          onClick={() => setAnnual(!annual)}
          className={`relative inline-flex h-7 w-[52px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 ${
            annual ? "bg-violet-600" : "bg-zinc-700"
          }`}
          role="switch"
          aria-checked={annual}
        >
          <span
            className={`pointer-events-none block h-[22px] w-[22px] rounded-full bg-white shadow-lg ring-0 transition-transform ${
              annual ? "translate-x-[26px]" : "translate-x-0.5"
            }`}
          />
        </button>
        <span
          className={`text-sm font-medium transition-colors ${
            annual ? "text-white" : "text-zinc-500"
          }`}
        >
          Annual
        </span>
        {annual && (
          <span className="ml-1 text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full">
            Save 25%
          </span>
        )}
      </div>

      {/* ─── Pricing Cards ─── */}
      <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* --- Free Card --- */}
        <div className="relative rounded-2xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-xl p-8 flex flex-col">
          <h2 className="text-2xl font-bold text-white">Free</h2>
          <p className="mt-1 text-sm text-zinc-400">Everything you need to get started</p>

          <div className="mt-6 flex items-baseline gap-1">
            <span className="text-5xl font-extrabold text-white tracking-tight">$0</span>
            <span className="text-zinc-500 text-sm ml-1">forever</span>
          </div>

          <Link
            href="/login"
            className="mt-8 block text-center rounded-xl py-3.5 font-semibold text-sm border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white transition-all duration-200"
          >
            Get Started
          </Link>

          {/* included */}
          <ul className="mt-8 space-y-3 flex-1">
            {freeFeatures.map((f) => (
              <li key={f.name} className="flex items-center gap-3 text-sm text-zinc-300">
                <Check className="text-violet-400" />
                {f.name}
              </li>
            ))}
          </ul>

          {/* not included */}
          <div className="mt-6 pt-6 border-t border-zinc-800">
            <ul className="space-y-3">
              {proOnlyFeatures.map((f) => (
                <li
                  key={f.name}
                  className="flex items-center gap-3 text-sm text-zinc-600"
                >
                  <XMark className="text-zinc-700" />
                  <span className="line-through">{f.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* --- Pro Card --- */}
        <div className="relative rounded-2xl p-[1px] bg-gradient-to-b from-violet-500 via-violet-600/50 to-transparent">
          <div className="rounded-2xl bg-zinc-900/90 backdrop-blur-xl p-8 flex flex-col h-full">
            {/* badge */}
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white text-xs font-bold uppercase tracking-wider px-4 py-1 rounded-full shadow-lg shadow-violet-500/25">
              Most Popular
            </span>

            <h2 className="text-2xl font-bold text-white">Pro</h2>
            <p className="mt-1 text-sm text-zinc-400">
              For designers who need the full toolkit
            </p>

            <div className="mt-6 flex items-baseline gap-1">
              <span className="text-5xl font-extrabold text-white tracking-tight">
                {proPrice}
              </span>
              <span className="text-zinc-500 text-sm ml-1">{proPeriod}</span>
            </div>
            {annual && (
              <p className="mt-1 text-xs text-zinc-500">
                $72 billed once per year
              </p>
            )}

            <Link
              href="/login"
              className="mt-8 block text-center rounded-xl py-3.5 font-semibold text-sm bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white transition-all duration-200 shadow-lg shadow-violet-600/25"
            >
              Start Free Trial
            </Link>

            {/* all features */}
            <ul className="mt-8 space-y-3 flex-1">
              {features.map((f) => (
                <li key={f.name} className="flex items-center gap-3 text-sm text-zinc-300">
                  <Check className="text-violet-400" />
                  <span>{f.name}</span>
                  {f.badge && (
                    <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full">
                      {f.badge}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ─── Feature Comparison Table ─── */}
      <div className="max-w-4xl mx-auto px-6 mt-28">
        <h2 className="text-3xl font-bold text-white text-center mb-2">
          Compare Plans
        </h2>
        <p className="text-zinc-400 text-center mb-10">
          See exactly what you get with each plan
        </p>

        <div className="rounded-2xl border border-zinc-800 overflow-hidden backdrop-blur-xl">
          {/* table header */}
          <div className="grid grid-cols-3 bg-zinc-900/80 border-b border-zinc-800 text-sm font-semibold">
            <div className="px-6 py-4 text-zinc-400">Feature</div>
            <div className="px-6 py-4 text-center text-zinc-400">Free</div>
            <div className="px-6 py-4 text-center text-violet-400">Pro</div>
          </div>

          {/* table rows */}
          {features.map((f, i) => (
            <div
              key={f.name}
              className={`grid grid-cols-3 text-sm border-b border-zinc-800/50 last:border-b-0 ${
                i % 2 === 0 ? "bg-zinc-900/40" : "bg-zinc-900/20"
              }`}
            >
              <div className="px-6 py-3.5 text-zinc-300 flex items-center gap-2">
                {f.name}
                {f.badge && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400 bg-violet-500/10 px-1.5 py-0.5 rounded-full">
                    {f.badge}
                  </span>
                )}
              </div>
              <div className="px-6 py-3.5 flex justify-center items-center">
                {f.free ? (
                  <Check className="text-violet-400" />
                ) : (
                  <XMark className="text-zinc-700" />
                )}
              </div>
              <div className="px-6 py-3.5 flex justify-center items-center">
                <Check className="text-violet-400" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── FAQ ─── */}
      <div className="max-w-3xl mx-auto px-6 mt-28">
        <h2 className="text-3xl font-bold text-white text-center mb-2">
          Frequently Asked Questions
        </h2>
        <p className="text-zinc-400 text-center mb-10">
          Got questions? We have answers.
        </p>

        <div className="space-y-4">
          {[
            {
              q: "Can I cancel anytime?",
              a: "Yes! There are no long-term contracts or commitments. You can cancel your subscription at any time from your account settings and you will not be charged again.",
            },
            {
              q: "Is there a free trial?",
              a: "Absolutely. Our Free tier gives you full access to core features with no credit card required. When you are ready for advanced tools, upgrade to Pro and try it risk-free.",
            },
            {
              q: "What payment methods do you accept?",
              a: "We accept all major credit cards (Visa, Mastercard, American Express) processed securely through Stripe. We never store your card details on our servers.",
            },
            {
              q: "Do you offer team plans?",
              a: "Team plans are coming soon! If you are interested in early access for your team, contact us at hello@myfontpreview.com and we will get you set up.",
            },
          ].map(({ q, a }) => (
            <details
              key={q}
              className="group rounded-xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-xl overflow-hidden"
            >
              <summary className="flex items-center justify-between gap-4 cursor-pointer px-6 py-5 text-white font-medium text-sm select-none list-none">
                {q}
                <svg
                  className="w-5 h-5 text-zinc-500 shrink-0 transition-transform group-open:rotate-45"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </summary>
              <div className="px-6 pb-5 text-sm text-zinc-400 leading-relaxed">
                {a}
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* ─── Final CTA ─── */}
      <div className="max-w-2xl mx-auto px-6 mt-28 mb-8 text-center">
        <div className="rounded-2xl border border-zinc-800 bg-gradient-to-b from-violet-600/10 to-transparent backdrop-blur-xl p-12">
          <h2 className="text-3xl font-bold text-white">
            Ready to unlock all features?
          </h2>
          <p className="mt-3 text-zinc-400 max-w-md mx-auto">
            Join thousands of designers who use My Font Preview Pro to streamline their typography workflow.
          </p>
          <Link
            href="/login"
            className="mt-8 inline-flex items-center justify-center rounded-xl px-8 py-3.5 font-semibold text-sm bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white transition-all duration-200 shadow-lg shadow-violet-600/25"
          >
            Get Started for Free
          </Link>
        </div>
      </div>
    </>
  );
}
