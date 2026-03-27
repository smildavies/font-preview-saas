'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { findPairings, getClassification, type PairingResult } from '@/lib/fontPairing';

interface PairingModalProps {
  isOpen: boolean;
  onClose: () => void;
  fontFamily: string;
  fontName: string;
  allFonts: string[];
}

export default function PairingModal({
  isOpen,
  onClose,
  fontFamily,
  fontName,
  allFonts,
}: PairingModalProps) {
  const [toast, setToast] = useState<string | null>(null);

  const classification = useMemo(
    () => (fontFamily ? getClassification(fontFamily) : 'sans-serif'),
    [fontFamily],
  );

  const pairings = useMemo<PairingResult[]>(
    () => (fontFamily && allFonts.length > 0 ? findPairings(fontFamily, allFonts) : []),
    [fontFamily, allFonts],
  );

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

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1500);
  }, []);

  const handleCopyBothCSS = (pairedFont: string) => {
    const css = `/* Heading */\nfont-family: '${fontFamily}', sans-serif;\n\n/* Body */\nfont-family: '${pairedFont}', sans-serif;`;
    navigator.clipboard.writeText(css);
    showToast('Copied CSS for both fonts');
  };

  if (!isOpen) return null;

  const classLabel = classification.charAt(0).toUpperCase() + classification.slice(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 flex h-[85vh] w-full max-w-3xl flex-col rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl mx-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-100">
              Font Pairings for{' '}
              <span className="text-violet-400">{fontName}</span>
            </h2>
            <div className="mt-1 flex items-center gap-2">
              <span className="inline-flex items-center rounded-md bg-violet-600/20 px-2 py-0.5 text-xs font-medium text-violet-400">
                {classLabel}
              </span>
              <span className="text-xs text-zinc-500">
                {pairings.length} pairing{pairings.length !== 1 ? 's' : ''} found
              </span>
            </div>
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

        {/* Pairing List */}
        <div className="flex-1 overflow-auto px-6 py-4 space-y-4">
          {pairings.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-zinc-500">
              <svg className="h-12 w-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <p className="text-sm">No pairings available. Add more fonts to see suggestions.</p>
            </div>
          ) : (
            pairings.map((pairing, i) => {
              const pairedClass = getClassification(pairing.font);
              const pairedLabel = pairedClass.charAt(0).toUpperCase() + pairedClass.slice(1);

              return (
                <div
                  key={pairing.font + i}
                  className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 transition-all hover:border-zinc-700"
                >
                  {/* Info row */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-semibold text-zinc-200 truncate">
                          {pairing.font}
                        </h3>
                        <span className="inline-flex items-center rounded-md bg-zinc-800 px-2 py-0.5 text-[10px] font-medium text-zinc-400">
                          {pairedLabel}
                        </span>
                        <span className="inline-flex items-center rounded-md bg-violet-600/10 px-2 py-0.5 text-[10px] font-medium text-violet-400 capitalize">
                          {pairing.role}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-zinc-500">{pairing.reason}</p>
                    </div>
                    <button
                      onClick={() => handleCopyBothCSS(pairing.font)}
                      className="shrink-0 rounded-lg bg-violet-600/20 px-3 py-1.5 text-xs font-medium text-violet-400 hover:bg-violet-600/30 transition-colors"
                    >
                      Copy Both CSS
                    </button>
                  </div>

                  {/* Live preview */}
                  <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-4 space-y-2">
                    <p
                      className="text-xl text-zinc-100 leading-tight"
                      style={{ fontFamily: `"${fontFamily}", sans-serif` }}
                    >
                      The Quick Brown Fox
                    </p>
                    <p
                      className="text-sm text-zinc-400 leading-relaxed"
                      style={{ fontFamily: `"${pairing.font}", sans-serif` }}
                    >
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                      eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                  </div>
                </div>
              );
            })
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
