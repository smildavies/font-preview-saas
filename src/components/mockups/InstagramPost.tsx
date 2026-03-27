'use client';

interface InstagramPostProps {
  fontFamily: string;
}

export default function InstagramPost({ fontFamily }: InstagramPostProps) {
  return (
    <div className="flex items-center justify-center py-12">
      {/* Phone frame hint */}
      <div className="rounded-2xl bg-zinc-800/50 p-3 shadow-2xl shadow-black/40">
        {/* Post */}
        <div
          className="relative flex w-[380px] flex-col items-center justify-center overflow-hidden rounded-xl"
          style={{ aspectRatio: '1 / 1' }}
        >
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-pink-500" />

          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_50%,white_1px,transparent_1px),radial-gradient(circle_at_80%_20%,white_1px,transparent_1px)] bg-[length:60px_60px]" />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center px-10 text-center">
            {/* Decorative open quote */}
            <span className="mb-4 text-5xl leading-none text-white/30">&ldquo;</span>

            <p
              className="text-xl font-medium leading-relaxed text-white"
              style={{ fontFamily }}
            >
              Design is not just what it looks like. Design is how it works.
            </p>

            {/* Decorative line */}
            <div className="my-5 h-px w-16 bg-white/30" />

            <p
              className="text-sm tracking-wide text-white/70"
              style={{ fontFamily }}
            >
              &mdash; Steve Jobs
            </p>
          </div>
        </div>

        {/* Fake Instagram actions bar */}
        <div className="mt-2 flex items-center gap-4 px-2 py-1">
          <svg className="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
          <svg className="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
          </svg>
          <svg className="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
          <div className="ml-auto">
            <svg className="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
