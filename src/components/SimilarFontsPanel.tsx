'use client';

import { useCallback, useEffect, useState } from 'react';
import { findSimilarFonts, type SimilarResult } from '@/lib/fontSimilarity';

interface SimilarFontsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  fontFamily: string;
  fontName: string;
  allFonts: string[];
}

export default function SimilarFontsPanel({
  isOpen,
  onClose,
  fontFamily,
  fontName,
  allFonts,
}: SimilarFontsPanelProps) {
  const [results, setResults] = useState<SimilarResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Escape key handler
  useEffect(() => {
    if (isOpen) {
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }
  }, [isOpen, onClose]);

  // Compute similarity when opened
  useEffect(() => {
    if (isOpen && fontFamily && allFonts.length > 0) {
      setLoading(true);
      // Use requestAnimationFrame to let the UI render the loading state first
      requestAnimationFrame(() => {
        const similar = findSimilarFonts(fontFamily, allFonts, 8);
        setResults(similar);
        setLoading(false);
      });
    } else if (!isOpen) {
      setResults([]);
    }
  }, [isOpen, fontFamily, allFonts]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1500);
  }, []);

  const handleCopyFontName = (name: string) => {
    navigator.clipboard.writeText(name);
    showToast(`Copied "${name}"`);
  };

  function getScoreColor(score: number): string {
    if (score > 80) return 'bg-emerald-900/50 text-emerald-400 border-emerald-800';
    if (score > 60) return 'bg-yellow-900/50 text-yellow-400 border-yellow-800';
    return 'bg-orange-900/50 text-orange-400 border-orange-800';
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Slide-in Panel */}
      <div className="relative z-10 flex h-full w-full max-w-lg flex-col border-l border-zinc-800 bg-zinc-950 shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-100">
              Fonts Similar to{' '}
              <span className="text-violet-400">{fontName}</span>
            </h2>
            <p className="mt-0.5 text-xs text-zinc-500">
              Based on measured typographic metrics
            </p>
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

        {/* Content */}
        <div className="flex-1 overflow-auto px-6 py-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3">
              <svg className="h-8 w-8 animate-spin text-violet-500" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <p className="text-sm text-zinc-500">Measuring font metrics...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-zinc-500">
              <svg className="h-12 w-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <p className="text-sm">No similar fonts found. Add more fonts to compare.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {results.map((result) => (
                <div
                  key={result.font}
                  className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 transition-all hover:border-zinc-700"
                >
                  {/* Top row: name + score */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className="text-sm font-semibold text-zinc-200 truncate">
                      {result.font}
                    </h3>
                    <span
                      className={`shrink-0 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold tabular-nums ${getScoreColor(result.score)}`}
                    >
                      {result.score}% match
                    </span>
                  </div>

                  {/* Reason */}
                  <p className="text-xs text-zinc-500 mb-3">{result.reason}</p>

                  {/* Preview */}
                  <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 px-4 py-3 mb-3">
                    <p
                      className="text-lg text-zinc-200 tracking-wide"
                      style={{ fontFamily: `"${result.font}", sans-serif` }}
                    >
                      Aa Bb Cc 123
                    </p>
                  </div>

                  {/* Action */}
                  <button
                    onClick={() => handleCopyFontName(result.font)}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:border-violet-600 hover:bg-violet-600/10 hover:text-violet-400 transition-colors"
                  >
                    Use This Font
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
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
