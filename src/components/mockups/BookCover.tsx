'use client';

interface BookCoverProps {
  fontFamily: string;
}

export default function BookCover({ fontFamily }: BookCoverProps) {
  return (
    <div className="flex items-center justify-center py-12">
      {/* Book with 3D effect */}
      <div className="relative">
        {/* Spine shadow */}
        <div className="absolute -left-3 top-2 bottom-2 w-6 rounded-l-sm bg-gradient-to-r from-black/50 to-transparent blur-sm" />

        {/* Book */}
        <div
          className="relative w-[280px] overflow-hidden rounded-r-md rounded-l-sm border border-zinc-700/30 shadow-2xl shadow-black/60"
          style={{ aspectRatio: '2 / 3' }}
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-emerald-900 to-zinc-900" />

          {/* Subtle texture overlay */}
          <div className="absolute inset-0 opacity-[0.03] bg-[repeating-linear-gradient(45deg,white_0px,white_1px,transparent_1px,transparent_8px)]" />

          {/* Content */}
          <div className="relative flex h-full flex-col items-center justify-between px-8 py-10 text-center">
            {/* Top decorative border */}
            <div className="w-full">
              <div className="mx-auto h-px w-3/4 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
              <div className="mx-auto mt-1 h-px w-1/2 bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />
            </div>

            {/* Title area */}
            <div className="flex flex-col items-center gap-3">
              <p className="text-[10px] tracking-[0.4em] text-amber-400/60 uppercase">
                A Novel
              </p>
              <h2
                className="text-3xl font-bold leading-tight tracking-wide text-white"
                style={{ fontFamily }}
              >
                THE
                <br />
                SILENT
                <br />
                HOUR
              </h2>
              {/* Ornament */}
              <div className="flex items-center gap-2">
                <div className="h-px w-8 bg-amber-400/40" />
                <div className="h-1.5 w-1.5 rotate-45 border border-amber-400/40" />
                <div className="h-px w-8 bg-amber-400/40" />
              </div>
            </div>

            {/* Author */}
            <div className="w-full">
              <div className="mx-auto mb-3 h-px w-1/2 bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />
              <p
                className="text-xs font-medium tracking-[0.3em] text-amber-200/70"
                style={{ fontFamily }}
              >
                JAMES WHITMORE
              </p>
              <div className="mx-auto mt-3 h-px w-3/4 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
              <div className="mx-auto mt-1 h-px w-1/2 bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />
            </div>
          </div>

          {/* Spine edge highlight */}
          <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-white/10 via-white/5 to-white/10" />
        </div>
      </div>
    </div>
  );
}
