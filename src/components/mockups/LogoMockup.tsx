'use client';

interface LogoMockupProps {
  fontFamily: string;
}

export default function LogoMockup({ fontFamily }: LogoMockupProps) {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="relative flex flex-col items-center rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-black px-24 py-20 shadow-2xl shadow-black/50 border border-zinc-800/50">
        {/* Subtle radial glow */}
        <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.06)_0%,transparent_70%)]" />

        <div className="relative flex items-center gap-5">
          {/* Geometric shape - diamond */}
          <div className="flex h-16 w-16 items-center justify-center">
            <div className="h-11 w-11 rotate-45 rounded-sm border-2 border-violet-400/80 bg-violet-500/10" />
          </div>

          {/* Logo text */}
          <h1
            className="text-7xl font-bold tracking-wider text-white"
            style={{ fontFamily }}
          >
            AURORA
          </h1>
        </div>

        {/* Tagline */}
        <p
          className="mt-4 text-lg tracking-[0.3em] text-zinc-500"
          style={{ fontFamily }}
        >
          Design Studio
        </p>

        {/* Decorative line */}
        <div className="mt-6 h-px w-32 bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
      </div>
    </div>
  );
}
