'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

interface GlyphModalProps {
  isOpen: boolean;
  onClose: () => void;
  fontName: string;
  fontFamilyId: string;
}

interface GlyphRange {
  label: string;
  start: number;
  end: number;
}

const GLYPH_RANGES: GlyphRange[] = [
  { label: 'Basic Latin (A-Z, 0-9)', start: 0x0020, end: 0x007f },
  { label: 'Extended Latin', start: 0x0080, end: 0x024f },
  { label: 'Punctuation & Symbols', start: 0x2000, end: 0x20cf },
  { label: 'Math Symbols', start: 0x2200, end: 0x22ff },
  { label: 'Arrows & Misc', start: 0x2190, end: 0x21ff },
  { label: 'Dingbats & Ornaments', start: 0x2700, end: 0x27bf },
  { label: 'Box Drawing', start: 0x2500, end: 0x257f },
  { label: 'Geometric Shapes', start: 0x25a0, end: 0x25ff },
];

export default function GlyphModal({
  isOpen,
  onClose,
  fontName,
  fontFamilyId,
}: GlyphModalProps) {
  const [selectedRange, setSelectedRange] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGlyphs, setSelectedGlyphs] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const fontFamily = fontFamilyId;

  useEffect(() => {
    if (!isOpen) {
      setSelectedGlyphs([]);
      setSearchQuery('');
      setSelectedRange(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }
  }, [isOpen, onClose]);

  const glyphs = useMemo(() => {
    const range = GLYPH_RANGES[selectedRange];
    const chars: { char: string; code: number }[] = [];
    for (let i = range.start; i <= range.end; i++) {
      const char = String.fromCodePoint(i);
      chars.push({ char, code: i });
    }
    return chars;
  }, [selectedRange]);

  const filteredGlyphs = useMemo(() => {
    if (!searchQuery.trim()) return glyphs;
    const q = searchQuery.trim().toLowerCase();

    // Search by character
    if (q.length === 1) {
      return glyphs.filter((g) => g.char === q);
    }

    // Search by unicode hex code
    if (q.startsWith('u+') || q.startsWith('0x')) {
      const hex = q.replace(/^(u\+|0x)/, '');
      const code = parseInt(hex, 16);
      if (!isNaN(code)) {
        return glyphs.filter((g) => g.code === code);
      }
    }

    // Search by decimal code
    const dec = parseInt(q, 10);
    if (!isNaN(dec)) {
      return glyphs.filter((g) => g.code === dec);
    }

    return glyphs;
  }, [glyphs, searchQuery]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1500);
  }, []);

  const handleGlyphClick = (char: string) => {
    navigator.clipboard.writeText(char);
    showToast(`Copied "${char}"`);
    setSelectedGlyphs((prev) =>
      prev.includes(char) ? prev.filter((c) => c !== char) : [...prev, char]
    );
  };

  const handleCopyAll = () => {
    const text = selectedGlyphs.join('');
    navigator.clipboard.writeText(text);
    showToast('Copied all selected glyphs');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 flex h-[85vh] w-full max-w-4xl flex-col rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl mx-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-100">Glyph Map</h2>
            <p className="text-sm text-zinc-500">{fontName}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 border-b border-zinc-800 px-6 py-3">
          <select
            value={selectedRange}
            onChange={(e) => setSelectedRange(Number(e.target.value))}
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-200 focus:border-violet-600 focus:outline-none"
          >
            {GLYPH_RANGES.map((r, i) => (
              <option key={r.label} value={i}>
                {r.label}
              </option>
            ))}
          </select>

          <div className="relative">
            <svg
              className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search char or U+code..."
              className="rounded-lg border border-zinc-700 bg-zinc-900 pl-8 pr-3 py-1.5 text-sm text-zinc-200 placeholder-zinc-600 focus:border-violet-600 focus:outline-none w-52"
            />
          </div>

          <span className="text-xs text-zinc-600">
            {filteredGlyphs.length} glyphs
          </span>
        </div>

        {/* Glyph grid */}
        <div className="flex-1 overflow-auto px-6 py-4">
          <div className="grid grid-cols-8 gap-1.5 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-[repeat(14,minmax(0,1fr))]">
            {filteredGlyphs.map((g) => (
              <button
                key={g.code}
                onClick={() => handleGlyphClick(g.char)}
                className={`flex flex-col items-center justify-center rounded-lg border p-2 transition-colors hover:border-violet-600 hover:bg-violet-600/10 ${
                  selectedGlyphs.includes(g.char)
                    ? 'border-violet-500 bg-violet-600/20'
                    : 'border-zinc-800 bg-zinc-900/50'
                }`}
                title={`U+${g.code.toString(16).toUpperCase().padStart(4, '0')}`}
              >
                <span
                  className="text-xl text-zinc-200"
                  style={{ fontFamily: `"${fontFamily}", sans-serif` }}
                >
                  {g.char}
                </span>
                <span className="mt-0.5 text-[9px] font-mono text-zinc-600">
                  {g.code.toString(16).toUpperCase().padStart(4, '0')}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected glyphs row */}
        {selectedGlyphs.length > 0 && (
          <div className="flex items-center gap-3 border-t border-zinc-800 px-6 py-3">
            <span className="text-xs text-zinc-500 shrink-0">Selected:</span>
            <div
              className="flex-1 overflow-x-auto text-lg text-zinc-200 whitespace-nowrap"
              style={{ fontFamily: `"${fontFamily}", sans-serif` }}
            >
              {selectedGlyphs.join(' ')}
            </div>
            <button
              onClick={handleCopyAll}
              className="shrink-0 rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-violet-500 transition-colors"
            >
              Copy All
            </button>
            <button
              onClick={() => setSelectedGlyphs([])}
              className="shrink-0 rounded-lg px-3 py-1.5 text-xs text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300 transition-colors"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-8 left-1/2 z-[60] -translate-x-1/2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow-lg animate-pulse">
          {toast}
        </div>
      )}
    </div>
  );
}
