'use client';

import { ReactNode } from 'react';

interface ProGateProps {
  isPro: boolean;
  feature: string;
  children: ReactNode;
}

export default function ProGate({ isPro, feature, children }: ProGateProps) {
  if (isPro) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {/* Blurred/dimmed children */}
      <div className="pointer-events-none select-none opacity-30 blur-[2px]">
        {children}
      </div>

      {/* Lock overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl bg-zinc-950/60 backdrop-blur-[1px]">
        <svg
          className="h-10 w-10 text-violet-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
          />
        </svg>
        <p className="text-sm font-medium text-zinc-300">{feature}</p>
        <a
          href="/api/stripe/checkout"
          className="rounded-lg bg-violet-600 px-5 py-2 text-sm font-medium text-white shadow-lg shadow-violet-600/20 hover:bg-violet-500 transition-colors"
        >
          Upgrade to Pro
        </a>
      </div>
    </div>
  );
}
