'use client';

interface WebsiteHeaderProps {
  fontFamily: string;
}

export default function WebsiteHeader({ fontFamily }: WebsiteHeaderProps) {
  return (
    <div className="flex items-center justify-center py-10">
      {/* Browser chrome */}
      <div className="w-full max-w-[640px] overflow-hidden rounded-xl border border-zinc-700/50 bg-zinc-900 shadow-2xl shadow-black/50">
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-zinc-800 bg-zinc-900 px-4 py-2.5">
          <div className="h-3 w-3 rounded-full bg-red-500/70" />
          <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
          <div className="h-3 w-3 rounded-full bg-green-500/70" />
          <div className="ml-4 flex-1 rounded-md bg-zinc-800 px-3 py-1 text-center text-[10px] text-zinc-500">
            www.example.com
          </div>
        </div>

        {/* Website content */}
        <div className="bg-[#0f172a]" style={{ aspectRatio: '16 / 9' }}>
          {/* Nav */}
          <nav className="flex items-center justify-between px-8 py-4">
            <span
              className="text-sm font-bold tracking-wide text-white"
              style={{ fontFamily }}
            >
              STUDIO
            </span>
            <div className="flex gap-6">
              {['Home', 'About', 'Services', 'Contact'].map((item) => (
                <span
                  key={item}
                  className="text-xs text-slate-400 hover:text-white transition-colors cursor-default"
                >
                  {item}
                </span>
              ))}
            </div>
          </nav>

          {/* Divider */}
          <div className="mx-8 h-px bg-slate-800" />

          {/* Hero */}
          <div className="flex flex-col items-center justify-center px-8 pt-12 pb-8 text-center">
            <h1
              className="text-4xl font-bold leading-tight text-white sm:text-5xl"
              style={{ fontFamily }}
            >
              We Create Digital
              <br />
              Experiences
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-400">
              Transform your brand with cutting-edge design and innovative technology solutions.
            </p>
            <button className="mt-6 rounded-lg bg-violet-600 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-violet-600/25 transition-colors hover:bg-violet-500">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
