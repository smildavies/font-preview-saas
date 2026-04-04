'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  findPairings,
  getClassification,
  type PairingResult,
} from '@/lib/fontPairing';

interface PairingModalProps {
  isOpen: boolean;
  onClose: () => void;
  fontFamily: string;
  fontName: string;
  allFonts: string[];
  loadGoogleFont?: (family: string) => void;
}

function ScoreRing({ score, size = 52 }: { score: number; size?: number }) {
  const r = size * 0.346; // ~18 for size 52
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color =
    score >= 85
      ? '#a78bfa'
      : score >= 70
        ? '#818cf8'
        : score >= 50
          ? '#60a5fa'
          : '#94a3b8';
  const center = size / 2;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={center} cy={center} r={r} fill="none" stroke="#27272a" strokeWidth="3" />
        <circle
          cx={center}
          cy={center}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <span className="absolute text-xs font-bold" style={{ color }}>
        {score}
      </span>
    </div>
  );
}

type MockupTab = 'magazine' | 'brand' | 'card';

function PairingMockups({
  headingFont,
  bodyFont,
  customText,
  activeTab,
  onTabChange,
}: {
  headingFont: string;
  bodyFont: string;
  customText: string;
  activeTab: MockupTab;
  onTabChange: (tab: MockupTab) => void;
}) {
  const hStyle = { fontFamily: `"${headingFont}", sans-serif` };
  const bStyle = { fontFamily: `"${bodyFont}", sans-serif` };
  const heading = customText || 'Your Text Here';

  const tabs: { key: MockupTab; label: string; icon: string }[] = [
    { key: 'magazine', label: 'Magazine', icon: 'M4 6h16M4 12h16M4 18h12' },
    { key: 'brand', label: 'Brand', icon: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z' },
    { key: 'card', label: 'Business Card', icon: 'M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z' },
  ];

  return (
    <div className="mt-4">
      {/* Mockup tabs */}
      <div className="flex gap-1 mb-3">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => onTabChange(t.key)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-medium transition-all ${
              activeTab === t.key
                ? 'bg-violet-600/20 text-violet-400 ring-1 ring-violet-600/30'
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
            }`}
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d={t.icon} />
            </svg>
            {t.label}
          </button>
        ))}
      </div>

      {/* Magazine / Blog Layout */}
      {activeTab === 'magazine' && (
        <div className="rounded-xl border border-zinc-800/60 bg-zinc-950/60 overflow-hidden">
          {/* Simulated browser chrome */}
          <div className="flex items-center gap-1.5 px-3 py-2 bg-zinc-900/80 border-b border-zinc-800/40">
            <div className="w-2 h-2 rounded-full bg-zinc-700" />
            <div className="w-2 h-2 rounded-full bg-zinc-700" />
            <div className="w-2 h-2 rounded-full bg-zinc-700" />
            <div className="ml-3 flex-1 h-4 rounded bg-zinc-800/60 max-w-[180px]" />
          </div>
          <div className="p-5 space-y-3">
            <div className="flex items-center gap-2 text-[10px] text-violet-400 uppercase tracking-widest" style={bStyle}>
              <span>Design</span>
              <span className="text-zinc-700">/</span>
              <span>Typography</span>
            </div>
            <h4 className="text-xl md:text-2xl text-zinc-100 leading-tight tracking-tight" style={hStyle}>
              {heading}
            </h4>
            <div className="flex items-center gap-3 text-[11px] text-zinc-500" style={bStyle}>
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600" />
              <span>By Staff Writer</span>
              <span className="text-zinc-700">|</span>
              <span>5 min read</span>
            </div>
            <div className="h-px bg-zinc-800/60" />
            <p className="text-[12px] text-zinc-400 leading-relaxed" style={bStyle}>
              The landscape of modern design continues to evolve at a rapid pace. From bold
              typography choices to minimalist layouts, this year brings fresh approaches to
              visual communication that challenge conventional thinking and push creative
              boundaries in ways we haven&apos;t seen before.
            </p>
            <p className="text-[12px] text-zinc-500 leading-relaxed" style={bStyle}>
              Understanding how typefaces interact is fundamental to crafting compelling visual
              narratives. The interplay between heading and body text creates a rhythm that
              guides the reader&apos;s eye through content naturally.
            </p>
          </div>
        </div>
      )}

      {/* Brand / Logo Preview */}
      {activeTab === 'brand' && (
        <div className="rounded-xl border border-zinc-800/60 bg-gradient-to-br from-zinc-950 via-violet-950/20 to-zinc-950 overflow-hidden">
          <div className="p-8 flex flex-col items-center justify-center text-center min-h-[220px] space-y-4">
            {/* Logo mark */}
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-600/20">
              <span className="text-white text-lg font-bold" style={hStyle}>
                {heading.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="space-y-1.5">
              <h4 className="text-2xl md:text-3xl text-zinc-100 tracking-tight" style={hStyle}>
                {heading}
              </h4>
              <p className="text-sm text-zinc-400 tracking-wide" style={bStyle}>
                Crafted with intention. Built to inspire.
              </p>
            </div>
            <div className="flex gap-6 mt-2 text-[10px] text-zinc-500 uppercase tracking-[0.2em]" style={bStyle}>
              <span>About</span>
              <span>Services</span>
              <span>Portfolio</span>
              <span>Contact</span>
            </div>
          </div>
        </div>
      )}

      {/* Business Card */}
      {activeTab === 'card' && (
        <div className="flex justify-center py-2">
          <div
            className="rounded-xl border border-zinc-800/60 overflow-hidden shadow-2xl shadow-black/40"
            style={{ width: 340, aspectRatio: '3.5/2' }}
          >
            <div className="h-full bg-gradient-to-br from-zinc-900 to-zinc-950 p-5 flex flex-col justify-between relative">
              {/* Decorative accent */}
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-violet-600 to-indigo-600" />
              <div className="pl-3">
                <h4 className="text-lg text-zinc-100 tracking-wide" style={hStyle}>
                  {heading}
                </h4>
                <p className="text-[11px] text-violet-400 mt-0.5 tracking-wide" style={bStyle}>
                  Creative Director
                </p>
              </div>
              <div className="pl-3 space-y-1 text-[10px] text-zinc-500" style={bStyle}>
                <p>hello@{heading.toLowerCase().replace(/\s+/g, '')}.com</p>
                <p>+1 (555) 234-5678</p>
                <p className="text-zinc-600">www.{heading.toLowerCase().replace(/\s+/g, '')}.com</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PairingModal({
  isOpen,
  onClose,
  fontFamily,
  fontName,
  allFonts,
  loadGoogleFont,
}: PairingModalProps) {
  const [toast, setToast] = useState<string | null>(null);
  const [customText, setCustomText] = useState('');
  const [activeTabs, setActiveTabs] = useState<Record<number, MockupTab>>({});
  const [sourceRole, setSourceRole] = useState<'heading' | 'body' | null>(null);

  const classification = useMemo(
    () => (fontFamily ? getClassification(fontFamily) : 'sans-serif'),
    [fontFamily],
  );

  const pairings = useMemo<PairingResult[]>(() => {
    if (!fontFamily || allFonts.length === 0) return [];
    return findPairings(fontFamily, allFonts, sourceRole ?? undefined);
  }, [fontFamily, allFonts, sourceRole]);

  useEffect(() => {
    if (loadGoogleFont && pairings.length > 0) {
      pairings.forEach((p) => loadGoogleFont(p.font));
    }
  }, [pairings, loadGoogleFont]);

  useEffect(() => {
    if (isOpen) {
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }
  }, [isOpen, onClose]);

  // Reset state when modal opens for a new font
  useEffect(() => {
    if (isOpen) {
      setCustomText('');
      setActiveTabs({});
      setSourceRole(null);
    }
  }, [isOpen, fontFamily]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1500);
  }, []);

  const handleCopyCSS = (headingFont: string, bodyFont: string) => {
    const css = `/* Heading */\nfont-family: '${headingFont}', sans-serif;\n\n/* Body */\nfont-family: '${bodyFont}', sans-serif;`;
    navigator.clipboard.writeText(css);
    showToast('Copied CSS pair');
  };

  if (!isOpen) return null;

  const classLabel =
    classification.charAt(0).toUpperCase() + classification.slice(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 flex h-[92vh] w-full max-w-4xl flex-col rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl mx-4 overflow-hidden">
        {/* Header */}
        <div className="border-b border-zinc-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-600/20">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-zinc-100">
                  Smart Font Pairings
                </h2>
              </div>
              <div className="mt-1.5 flex items-center gap-2">
                <span
                  className="text-sm font-medium text-violet-400"
                  style={{ fontFamily: `"${fontFamily}", sans-serif` }}
                >
                  {fontName}
                </span>
                <span className="inline-flex items-center rounded-md bg-violet-600/20 px-2 py-0.5 text-[10px] font-medium text-violet-400">
                  {classLabel}
                </span>
                <div className="flex items-center gap-1 ml-2">
                  <span className="text-[10px] text-zinc-500 mr-1">Use as:</span>
                  {(['heading', 'body'] as const).map((role) => (
                    <button
                      key={role}
                      onClick={() => setSourceRole(sourceRole === role ? null : role)}
                      className={`px-2.5 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wide transition-all ${
                        sourceRole === role
                          ? role === 'heading'
                            ? 'bg-emerald-600/20 text-emerald-400 ring-1 ring-emerald-600/30'
                            : 'bg-violet-600/20 text-violet-400 ring-1 ring-violet-600/30'
                          : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
                <span className="text-xs text-zinc-500">
                  {pairings.length} pairing{pairings.length !== 1 ? 's' : ''} ranked by harmony
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

          {/* Custom text input */}
          <div className="mt-3 relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
            </div>
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Type your text to preview (e.g. My Business Name)..."
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 pl-10 pr-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:border-violet-600/50 focus:outline-none focus:ring-1 focus:ring-violet-600/30 transition-all"
              maxLength={60}
            />
            {customText && (
              <button
                onClick={() => setCustomText('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto px-6 py-4 space-y-4">
          {pairings.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-zinc-500">
              <p className="text-sm">No pairings available. Add more fonts to see suggestions.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 px-1">
                <div className="h-px flex-1 bg-gradient-to-r from-violet-600/40 to-transparent" />
                <span className="text-[10px] uppercase tracking-widest text-violet-500 font-medium">
                  Ranked by Typographic Harmony
                </span>
                <div className="h-px flex-1 bg-gradient-to-l from-violet-600/40 to-transparent" />
              </div>

              {pairings.map((pairing, i) => {
                // If sourceRole is set, source font takes that role; paired font gets opposite
                const headingFont = sourceRole
                  ? (sourceRole === 'heading' ? fontFamily : pairing.font)
                  : (pairing.role === 'heading' ? pairing.font : fontFamily);
                const bodyFont = sourceRole
                  ? (sourceRole === 'body' ? fontFamily : pairing.font)
                  : (pairing.role === 'body' ? pairing.font : fontFamily);
                const tabKey = activeTabs[i] || 'magazine';

                return (
                  <div
                    key={pairing.font + i}
                    className="group rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 transition-all hover:border-violet-800/50 hover:shadow-lg hover:shadow-violet-600/5"
                  >
                    <div className="flex items-start gap-4">
                      {/* Score ring */}
                      <ScoreRing score={pairing.score} />

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3
                            className="text-base font-semibold text-zinc-100 truncate"
                            style={{ fontFamily: `"${pairing.font}", sans-serif` }}
                          >
                            {pairing.font}
                          </h3>
                          <span className="inline-flex items-center rounded-full bg-violet-600/10 px-2.5 py-0.5 text-[10px] font-medium text-violet-400 capitalize ring-1 ring-inset ring-violet-600/20">
                            {pairing.role}
                          </span>
                        </div>

                        <p className="mt-1.5 text-xs text-zinc-400 leading-relaxed">
                          {pairing.reason}
                        </p>

                        {/* Mood tags + Use case */}
                        <div className="mt-3 flex items-center gap-2 flex-wrap">
                          {pairing.moods?.map((mood) => (
                            <span
                              key={mood}
                              className="inline-flex items-center rounded-full bg-zinc-800/80 px-2 py-0.5 text-[10px] text-zinc-400 ring-1 ring-inset ring-zinc-700"
                            >
                              {mood}
                            </span>
                          ))}
                          {pairing.useCase && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-600/10 px-2.5 py-0.5 text-[10px] text-indigo-400 ring-1 ring-inset ring-indigo-600/20">
                              <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                              </svg>
                              {pairing.useCase}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Copy button */}
                      <button
                        onClick={() => handleCopyCSS(headingFont, bodyFont)}
                        className="shrink-0 rounded-lg bg-violet-600/20 px-3 py-1.5 text-xs font-medium text-violet-400 hover:bg-violet-600/30 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        Copy CSS
                      </button>
                    </div>

                    {/* Interactive Mockups */}
                    <PairingMockups
                      headingFont={headingFont}
                      bodyFont={bodyFont}
                      customText={customText}
                      activeTab={tabKey}
                      onTabChange={(tab) => setActiveTabs((prev) => ({ ...prev, [i]: tab }))}
                    />
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-zinc-800 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
            <span className="text-[10px] text-zinc-500">
              Powered by typography harmony analysis
            </span>
          </div>
          <span className="text-[10px] text-zinc-600">
            Scores based on contrast, weight, era & personality matching
          </span>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-8 left-1/2 z-[60] -translate-x-1/2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
