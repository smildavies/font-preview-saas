import Link from "next/link";

const features = [
  {
    title: "Instant Font Detection",
    description:
      "Automatically detects every font installed on your computer. No uploads, no setup — just open and go.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
      </svg>
    ),
  },
  {
    title: "Live Preview",
    description:
      "Type any text, adjust sizes, and change colors in real time. See exactly how your fonts will look.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: "Mockup Templates",
    description:
      "Preview fonts on business cards, Instagram posts, website headers, and more — see them in real context.",
    isNew: true,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
      </svg>
    ),
  },
  {
    title: "AI Font Pairing",
    description:
      "Get smart font pairing suggestions powered by AI. Find the perfect heading + body combo instantly.",
    isNew: true,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
  },
  {
    title: "Brand Kit Builder",
    description:
      "Save your favorite font and color combinations as reusable brand kits for consistent design systems.",
    isNew: true,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z" />
      </svg>
    ),
  },
  {
    title: "Client Sharing",
    description:
      "Share font selections with clients via link. They can view, vote, and leave feedback — no account needed.",
    isNew: true,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
  },
  {
    title: "Glyph Explorer",
    description:
      "Browse every character in any font. View Unicode mappings, special symbols, and ligatures at a glance.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    ),
  },
  {
    title: "Side-by-Side Compare",
    description:
      "Compare up to 6 fonts side by side. Quickly find the best match for headings, body text, and more.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      </svg>
    ),
  },
];

const testimonials = [
  {
    quote:
      "FontPreview saved me hours of font hunting. The mockup templates are incredible.",
    name: "Sarah K.",
    role: "Brand Designer",
  },
  {
    quote:
      "The client sharing feature is a game-changer. My clients can finally see the fonts I\u2019m proposing.",
    name: "Marcus T.",
    role: "Creative Director",
  },
  {
    quote:
      "I cancelled my other font tools. FontPreview does everything in one place.",
    name: "Priya R.",
    role: "UI Designer",
  },
];

const faqs = [
  {
    q: "How does FontPreview detect my fonts?",
    a: "FontPreview uses modern browser APIs (the Local Font Access API) to securely detect fonts installed on your computer. Your browser will ask for permission the first time, and then all your fonts appear instantly.",
  },
  {
    q: "Do I need to upload my fonts?",
    a: "No! That\u2019s the magic. FontPreview detects your locally installed fonts automatically. No uploading, no file management, no hassle.",
  },
  {
    q: "What browsers are supported?",
    a: "Chrome and Edge support full local font detection. Safari and Firefox will show a curated list of common system fonts. We recommend Chrome for the best experience.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Absolutely. There are no contracts or commitments. You can cancel your Pro subscription at any time from your account settings, and you\u2019ll keep access until the end of your billing period.",
  },
  {
    q: "Is my font data stored?",
    a: "No. Your fonts stay on your computer. We never upload, store, or have access to your font files. FontPreview reads font metadata in your browser only.",
  },
  {
    q: "Can clients use the share links without an account?",
    a: "Yes! Share links are fully public. Your clients can view font previews, vote on their favorites, and leave comments \u2014 all without creating an account.",
  },
];

function Stars() {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-950">
      {/* ===== STICKY NAVBAR ===== */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-white">
            Font<span className="text-violet-400">Preview</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="#features"
              className="hidden sm:inline text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="hidden sm:inline text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/login"
              className="text-sm bg-violet-600 hover:bg-violet-500 text-white px-5 py-2 rounded-lg font-medium transition-colors"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-violet-950/40 via-zinc-950 to-zinc-950" />

        <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-20 md:pt-32 md:pb-28">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white max-w-4xl animate-fade-in-up">
              See Every Font on Your Computer.{" "}
              <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
                Instantly.
              </span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-zinc-400 max-w-2xl animate-fade-in-up animation-delay-200">
              No uploads. No installs. FontPreview detects all your fonts and
              lets you preview, compare, and share them — in seconds.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 animate-fade-in-up animation-delay-400">
              <Link
                href="/login"
                className="px-8 py-3.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold text-base transition-all hover:shadow-lg hover:shadow-violet-600/25"
              >
                Get Started Free
              </Link>
              <Link
                href="#how-it-works"
                className="px-8 py-3.5 rounded-lg border border-white/15 hover:border-white/30 text-zinc-300 hover:text-white font-semibold text-base transition-all"
              >
                See How It Works
              </Link>
            </div>

            {/* Animated font preview */}
            <div className="mt-16 w-full max-w-3xl">
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 md:p-12">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="ml-3 text-xs text-zinc-500 animate-font-label" />
                </div>
                <p className="animate-font-cycle text-3xl md:text-4xl lg:text-5xl text-white/90 leading-tight transition-all">
                  The quick brown fox jumps over the lazy dog
                </p>
                <div className="mt-6 flex items-center gap-3 text-xs text-zinc-500">
                  <span className="px-2 py-1 rounded bg-white/5 border border-white/10">48px</span>
                  <span className="px-2 py-1 rounded bg-white/5 border border-white/10">Regular</span>
                  <span className="px-2 py-1 rounded bg-violet-500/20 border border-violet-500/30 text-violet-400">Auto-detected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SOCIAL PROOF BAR ===== */}
      <section className="border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <p className="text-center text-sm text-zinc-500 mb-6">
            Built for designers, by designers
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "1,500+", label: "Google Fonts" },
              { value: "All", label: "Your Installed Fonts" },
              { value: "6", label: "Mockup Templates" },
              { value: "\u221E", label: "Unlimited Comparisons" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-xs md:text-sm text-zinc-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything You Need
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto">
              A complete toolkit for previewing, managing, and sharing your font
              collections.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 hover:border-violet-500/40 hover:bg-white/[0.07] transition-all duration-300"
              >
                {feature.isNew && (
                  <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse">
                    New
                  </span>
                )}
                <div className="w-10 h-10 rounded-lg bg-violet-600/20 text-violet-400 flex items-center justify-center mb-4 group-hover:bg-violet-600/30 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-base font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== AI FONT PAIRING SHOWCASE ===== */}
      <section className="py-24 bg-white/[0.02] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  New
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-violet-500/20 text-violet-400 border border-violet-500/30">
                  Only on FontPreview
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                AI-Powered Font Pairing.{" "}
                <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
                  Like Nothing Else.
                </span>
              </h2>
              <p className="text-lg text-zinc-400 leading-relaxed mb-6">
                Our AI analyzes font characteristics — weight, x-height, contrast, and
                style — to suggest heading + body combinations that actually work
                together. Stop guessing. Start pairing with confidence.
              </p>
              <ul className="space-y-3 text-sm text-zinc-400">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-violet-400 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  Analyzes contrast, proportion, and mood
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-violet-400 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  Suggests complementary heading + body combos
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-violet-400 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  Works with your local fonts and Google Fonts
                </li>
              </ul>
            </div>
            {/* Visual mockup */}
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
                <span className="text-sm font-medium text-violet-400">AI Pairing Suggestion</span>
                <span className="ml-auto text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">98% Match</span>
              </div>
              <div className="rounded-xl bg-zinc-900/80 border border-white/10 p-6 mb-4">
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Heading</p>
                <p className="text-3xl font-bold text-white" style={{ fontFamily: "Georgia, serif" }}>
                  Playfair Display
                </p>
                <p className="text-xs text-zinc-600 mt-1">Serif &middot; High contrast &middot; Elegant</p>
              </div>
              <div className="flex items-center justify-center my-3">
                <div className="w-8 h-8 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
                  <span className="text-violet-400 text-xs font-bold">+</span>
                </div>
              </div>
              <div className="rounded-xl bg-zinc-900/80 border border-white/10 p-6 mb-6">
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Body</p>
                <p className="text-xl text-white/90" style={{ fontFamily: "system-ui, sans-serif" }}>
                  Inter — The quick brown fox jumps over the lazy dog
                </p>
                <p className="text-xs text-zinc-600 mt-1">Sans-serif &middot; Neutral &middot; Highly readable</p>
              </div>
              <div className="rounded-xl bg-gradient-to-r from-violet-600/10 to-pink-600/10 border border-violet-500/20 p-4">
                <p className="text-xs text-zinc-400">
                  <span className="text-violet-400 font-medium">Why this works:</span> The high contrast of Playfair Display
                  creates visual hierarchy, while Inter&apos;s neutral geometry provides excellent body readability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== GLYPH EXPLORER SHOWCASE ===== */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pink-600/5 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Visual glyph grid */}
            <div className="order-2 lg:order-1 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm font-medium text-white">Glyph Explorer</p>
                  <p className="text-xs text-zinc-500">Georgia &middot; 248 glyphs available</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-400">Latin</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-violet-500/20 border border-violet-500/30 text-violet-400">All</span>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {["A", "B", "C", "R", "a", "g", "k", "&", "@", "!", "?", "#", "\u00e9", "\u00f1", "\u00e6", "\u00df", "\u2014", "\u2026", "\u00a9", "\u2122", "\u2192"].map(
                  (glyph) => (
                    <div
                      key={glyph}
                      className="aspect-square rounded-lg bg-zinc-900/80 border border-white/10 flex items-center justify-center text-xl text-white/90 hover:border-violet-500/40 hover:bg-violet-600/10 transition-all cursor-pointer"
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      {glyph}
                    </div>
                  )
                )}
              </div>
              <div className="mt-4 flex items-center gap-4 text-xs text-zinc-500">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-violet-500" />
                  Unicode: U+0041
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-pink-500" />
                  Category: Uppercase Letter
                </span>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                Every Character. Every Symbol.{" "}
                <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
                  Every Glyph.
                </span>
              </h2>
              <p className="text-lg text-zinc-400 leading-relaxed mb-6">
                Dive deep into any font&apos;s character set. Browse all available glyphs,
                view Unicode mappings, discover hidden ligatures, and find the special
                symbols you need — all in a beautiful, searchable grid.
              </p>
              <ul className="space-y-3 text-sm text-zinc-400">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-violet-400 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  Full Unicode character browsing
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-violet-400 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  Ligature and alternate glyph discovery
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-violet-400 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  Special symbols, diacritics, and currency marks
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-violet-400 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  Click any glyph to copy it instantly
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===== MOCKUP SHOWCASE ===== */}
      <section className="py-24 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Preview Fonts in Context
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto">
              See how fonts look on real-world designs before you commit.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Business Card Mockup */}
            <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 hover:border-violet-500/30 transition-all">
              <div className="aspect-[16/10] rounded-lg bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 p-6 flex flex-col justify-between">
                <div>
                  <p className="text-xl font-bold text-white" style={{ fontFamily: "Georgia, serif" }}>
                    Jane Cooper
                  </p>
                  <p className="text-sm text-violet-400 mt-1" style={{ fontFamily: "Georgia, serif" }}>
                    Creative Director
                  </p>
                </div>
                <div className="text-xs text-zinc-500" style={{ fontFamily: "Georgia, serif" }}>
                  <p>jane@studio.co</p>
                  <p>+1 (555) 123-4567</p>
                </div>
              </div>
              <p className="mt-4 text-sm font-medium text-zinc-300 text-center">Business Card</p>
            </div>

            {/* Instagram Post Mockup */}
            <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 hover:border-violet-500/30 transition-all">
              <div className="aspect-square rounded-lg bg-gradient-to-br from-violet-900/60 to-pink-900/40 border border-white/10 p-6 flex flex-col items-center justify-center text-center">
                <p className="text-2xl font-bold text-white leading-tight" style={{ fontFamily: "Georgia, serif" }}>
                  Design is
                </p>
                <p className="text-2xl font-bold text-white leading-tight" style={{ fontFamily: "Georgia, serif" }}>
                  thinking made
                </p>
                <p className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent leading-tight" style={{ fontFamily: "Georgia, serif" }}>
                  visual.
                </p>
                <p className="text-xs text-zinc-400 mt-4" style={{ fontFamily: "Georgia, serif" }}>
                  @janestudio
                </p>
              </div>
              <p className="mt-4 text-sm font-medium text-zinc-300 text-center">Instagram Post</p>
            </div>

            {/* Website Header Mockup */}
            <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 hover:border-violet-500/30 transition-all">
              <div className="aspect-[16/10] rounded-lg bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 overflow-hidden">
                <div className="h-8 border-b border-white/10 flex items-center px-3 gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-500/60" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
                  <div className="w-2 h-2 rounded-full bg-green-500/60" />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-xs text-zinc-500" style={{ fontFamily: "Georgia, serif" }}>Home</span>
                    <span className="text-xs text-zinc-500" style={{ fontFamily: "Georgia, serif" }}>About</span>
                    <span className="text-xs text-zinc-500" style={{ fontFamily: "Georgia, serif" }}>Work</span>
                    <span className="text-xs text-zinc-500" style={{ fontFamily: "Georgia, serif" }}>Contact</span>
                  </div>
                  <p className="text-lg font-bold text-white" style={{ fontFamily: "Georgia, serif" }}>
                    We craft digital experiences
                  </p>
                  <p className="text-xs text-zinc-500 mt-1" style={{ fontFamily: "Georgia, serif" }}>
                    Award-winning design studio
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm font-medium text-zinc-300 text-center">Website Header</p>
            </div>
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/login"
              className="inline-flex px-8 py-3.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold text-base transition-all hover:shadow-lg hover:shadow-violet-600/25"
            >
              Try It Free
            </Link>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                num: "1",
                title: "Open FontPreview",
                desc: "Your fonts are detected automatically. No uploads needed.",
              },
              {
                num: "2",
                title: "Preview & Customize",
                desc: "Type any text, adjust sizes, compare fonts side by side.",
              },
              {
                num: "3",
                title: "Share & Export",
                desc: "Send font selections to clients or export preview images.",
              },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-600 to-violet-500 text-white text-xl font-bold flex items-center justify-center mx-auto mb-5 shadow-lg shadow-violet-600/30">
                  {step.num}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed max-w-xs mx-auto">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
          {/* Connecting line (desktop only) */}
          <div className="hidden md:block relative -mt-[7.5rem] mb-16">
            <div className="absolute top-7 left-[20%] right-[20%] h-px border-t border-dashed border-white/10" />
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-24 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">
            Loved by Designers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6"
              >
                <Stars />
                <p className="mt-4 text-zinc-300 leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-6 pt-4 border-t border-white/5">
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-zinc-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHY FONTPREVIEW COMPARISON TABLE ===== */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            Why FontPreview?
          </h2>
          <p className="text-zinc-400 text-center mb-14 max-w-xl mx-auto">
            See how we stack up against the alternatives.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4 text-zinc-400 font-medium">Feature</th>
                  <th className="py-4 px-4 text-center">
                    <span className="text-violet-400 font-bold">FontPreview</span>
                  </th>
                  <th className="py-4 px-4 text-center text-zinc-500">wordmark.it</th>
                  <th className="py-4 px-4 text-center text-zinc-500">FontBase</th>
                  <th className="py-4 px-4 text-center text-zinc-500">WhatTheFont</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "Auto Font Detection", fp: true, wm: true, fb: false, wf: false },
                  { feature: "AI Font Pairing", fp: true, wm: false, fb: false, wf: false },
                  { feature: "Glyph Explorer", fp: true, wm: false, fb: true, wf: false },
                  { feature: "Mockup Templates", fp: true, wm: false, fb: false, wf: false },
                  { feature: "Client Sharing", fp: true, wm: false, fb: false, wf: false },
                  { feature: "Brand Kits", fp: true, wm: false, fb: false, wf: false },
                ].map((row) => (
                  <tr key={row.feature} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 text-zinc-300">{row.feature}</td>
                    {[row.fp, row.wm, row.fb, row.wf].map((val, i) => (
                      <td key={i} className="py-3.5 px-4 text-center">
                        {val ? (
                          <svg className="w-5 h-5 text-emerald-400 mx-auto" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-zinc-700 mx-auto" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ===== PRICING PREVIEW ===== */}
      <section id="pricing" className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-zinc-400 text-center mb-14 max-w-xl mx-auto">
            Start free. Upgrade when you need more power.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Free */}
            <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
              <h3 className="text-lg font-semibold text-white mb-1">Free</h3>
              <p className="text-3xl font-bold text-white">
                $0<span className="text-sm font-normal text-zinc-500">/mo</span>
              </p>
              <ul className="mt-5 space-y-2.5 text-sm text-zinc-400">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-violet-400 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  Font detection
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-violet-400 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  Live preview
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-violet-400 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  Compare up to 3 fonts
                </li>
              </ul>
            </div>
            {/* Pro */}
            <div className="rounded-xl border border-violet-500/40 bg-violet-600/10 backdrop-blur-sm p-6 relative">
              <span className="absolute -top-3 left-6 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-violet-600 text-white">
                Popular
              </span>
              <h3 className="text-lg font-semibold text-white mb-1">Pro</h3>
              <p className="text-3xl font-bold text-white">
                $9<span className="text-sm font-normal text-zinc-400">/mo</span>
              </p>
              <ul className="mt-5 space-y-2.5 text-sm text-zinc-300">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-violet-400 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  Everything in Free
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-violet-400 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  Mockup templates
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-violet-400 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  AI font pairing
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-violet-400 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  Client sharing & voting
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-violet-400 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  Brand kit builder
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/pricing"
              className="text-sm text-violet-400 hover:text-violet-300 transition-colors font-medium"
            >
              View Full Pricing &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-24 bg-white/[0.02]">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-14">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm"
              >
                <summary className="flex items-center justify-between cursor-pointer px-6 py-4 text-white font-medium list-none">
                  {faq.q}
                  <svg
                    className="w-5 h-5 text-zinc-500 group-open:rotate-45 transition-transform duration-200 shrink-0 ml-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </summary>
                <div className="px-6 pb-5 text-sm text-zinc-400 leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-violet-950/20 to-zinc-950" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-violet-600/10 rounded-full blur-3xl" />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Ready to Preview Your Fonts?
          </h2>
          <p className="text-lg text-zinc-400 mb-10">
            Join thousands of designers who trust FontPreview for their
            typography workflow.
          </p>
          <Link
            href="/login"
            className="inline-flex px-10 py-4 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold text-lg transition-all hover:shadow-xl hover:shadow-violet-600/25"
          >
            Get Started Free — No Credit Card Required
          </Link>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-white/5 py-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Link href="/" className="text-lg font-bold text-white">
              Font<span className="text-violet-400">Preview</span>
            </Link>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-500">
              <Link href="#features" className="hover:text-white transition-colors">Features</Link>
              <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
              <Link href="/login" className="hover:text-white transition-colors">Login</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            </div>
            <p className="text-sm text-zinc-600">
              &copy; 2025 FontPreview. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
