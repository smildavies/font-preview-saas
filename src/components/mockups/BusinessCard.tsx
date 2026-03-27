'use client';

interface BusinessCardProps {
  fontFamily: string;
}

export default function BusinessCard({ fontFamily }: BusinessCardProps) {
  return (
    <div className="flex items-center justify-center py-12">
      {/* Card */}
      <div
        className="relative w-[420px] rounded-xl bg-white shadow-2xl shadow-black/40"
        style={{ aspectRatio: '3.5 / 2' }}
      >
        {/* Accent stripe */}
        <div className="absolute left-0 top-0 h-full w-1.5 rounded-l-xl bg-gradient-to-b from-violet-500 to-violet-700" />

        <div className="flex h-full flex-col justify-between px-10 py-7">
          {/* Top section */}
          <div>
            <h2
              className="text-2xl font-semibold tracking-tight text-zinc-900"
              style={{ fontFamily }}
            >
              Alexandra Chen
            </h2>
            <p
              className="mt-0.5 text-sm font-medium text-zinc-500"
              style={{ fontFamily }}
            >
              Creative Director
            </p>
          </div>

          {/* Bottom section */}
          <div className="flex items-end justify-between">
            <div className="space-y-0.5">
              <p className="text-[11px] text-zinc-400">+1 (415) 555-0128</p>
              <p className="text-[11px] text-zinc-400">alex@designstudio.co</p>
              <p className="text-[11px] text-zinc-400">www.designstudio.co</p>
            </div>
            <p
              className="text-xs font-bold tracking-[0.25em] text-zinc-800"
              style={{ fontFamily }}
            >
              DESIGN STUDIO
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
