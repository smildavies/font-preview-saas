'use client';

import { useEffect, useState } from 'react';

interface Font {
  id: string;
  name: string;
  format: string;
  file_size: number;
  familyId: string;
  fontUrl: string;
  storage_path: string;
}

interface ComparePanelProps {
  fonts: Font[];
  previewText: string;
  fontSize: number;
  letterSpacing: number;
  lineHeight: number;
  textColor: string;
  bold: boolean;
  italic: boolean;
  uppercase: boolean;
  underline: boolean;
  onRemove: (familyId: string) => void;
}

export default function ComparePanel({
  fonts,
  previewText,
  fontSize,
  letterSpacing,
  lineHeight,
  textColor,
  bold,
  italic,
  uppercase,
  underline,
  onRemove,
}: ComparePanelProps) {
  const [loadedFonts, setLoadedFonts] = useState<Set<string>>(new Set());

  useEffect(() => {
    fonts.forEach(async (font) => {
      const familyName = `font-${font.familyId}`;
      if (loadedFonts.has(familyName)) return;
      try {
        const face = new FontFace(familyName, `url(${font.fontUrl})`);
        const loaded = await face.load();
        document.fonts.add(loaded);
        setLoadedFonts((prev) => new Set(prev).add(familyName));
      } catch (err) {
        console.error('Failed to load font for compare:', font.name, err);
      }
    });
  }, [fonts, loadedFonts]);

  if (fonts.length === 0) return null;

  return (
    <div className="sticky bottom-0 z-40 border-t border-violet-900/50 bg-zinc-950/95 backdrop-blur-sm shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-xs font-medium text-violet-400 uppercase tracking-wider">
            Compare ({fonts.length}/6)
          </h3>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-1">
          {fonts.map((font) => {
            const familyName = `font-${font.familyId}`;
            return (
              <div
                key={font.familyId}
                className="relative shrink-0 w-64 rounded-lg border border-zinc-800 bg-zinc-900/60 overflow-hidden"
              >
                {/* Remove button */}
                <button
                  onClick={() => onRemove(font.familyId)}
                  className="absolute right-1.5 top-1.5 z-10 rounded-full bg-zinc-900/80 p-0.5 text-zinc-500 hover:bg-red-900/50 hover:text-red-400 transition-colors"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Font name */}
                <div className="border-b border-zinc-800 px-3 py-1.5">
                  <p className="truncate text-xs font-medium text-zinc-400">
                    {font.name}
                  </p>
                </div>

                {/* Preview */}
                <div className="px-3 py-3">
                  <p
                    className="truncate"
                    style={{
                      fontFamily: `"${familyName}", sans-serif`,
                      fontSize: `${Math.min(fontSize, 48)}px`,
                      letterSpacing: `${letterSpacing}px`,
                      lineHeight,
                      color: textColor,
                      fontWeight: bold ? 'bold' : 'normal',
                      fontStyle: italic ? 'italic' : 'normal',
                      textTransform: uppercase ? 'uppercase' : 'none',
                      textDecoration: underline ? 'underline' : 'none',
                    }}
                  >
                    {previewText || font.name}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
