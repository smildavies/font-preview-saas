'use client';

interface TShirtMockupProps {
  fontFamily: string;
}

export default function TShirtMockup({ fontFamily }: TShirtMockupProps) {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="relative">
        {/* T-shirt shape */}
        <svg
          viewBox="0 0 400 440"
          className="w-[360px] drop-shadow-2xl"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Shirt body */}
          <path
            d="M100 80 L40 120 L70 160 L100 140 L100 400 C100 415 112 425 130 425 L270 425 C288 425 300 415 300 400 L300 140 L330 160 L360 120 L300 80 L260 100 C245 110 220 118 200 118 C180 118 155 110 140 100 Z"
            fill="#d4d4d8"
            stroke="#a1a1aa"
            strokeWidth="1"
          />
          {/* Collar */}
          <path
            d="M140 100 C155 85 175 78 200 78 C225 78 245 85 260 100"
            fill="none"
            stroke="#a1a1aa"
            strokeWidth="1.5"
          />
          {/* Subtle fabric texture lines */}
          <line x1="120" y1="160" x2="120" y2="410" stroke="#c4c4c8" strokeWidth="0.3" opacity="0.3" />
          <line x1="160" y1="140" x2="160" y2="420" stroke="#c4c4c8" strokeWidth="0.3" opacity="0.3" />
          <line x1="200" y1="130" x2="200" y2="425" stroke="#c4c4c8" strokeWidth="0.3" opacity="0.3" />
          <line x1="240" y1="140" x2="240" y2="420" stroke="#c4c4c8" strokeWidth="0.3" opacity="0.3" />
          <line x1="280" y1="160" x2="280" y2="410" stroke="#c4c4c8" strokeWidth="0.3" opacity="0.3" />
        </svg>

        {/* Text overlay on shirt */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
          <p
            className="text-4xl font-black tracking-widest text-zinc-800"
            style={{ fontFamily }}
          >
            MAKE ART
          </p>
          <p
            className="text-lg font-medium tracking-[0.2em] text-zinc-600"
            style={{ fontFamily }}
          >
            NOT WAR
          </p>
        </div>
      </div>
    </div>
  );
}
