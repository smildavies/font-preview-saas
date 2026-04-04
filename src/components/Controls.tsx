'use client';

import { useState } from 'react';

const SAMPLE_TEXTS: Record<string, string> = {
  Custom: '',
  Pangram: 'The quick brown fox jumps over the lazy dog',
  Alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  Numbers: '0123456789 !@#$%^&*()_+-=[]{}|;:,.<>?',
  'Lorem Ipsum':
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
};

const BG_PRESETS_FREE = [
  { label: 'Dark', value: '#18181b' },
  { label: 'Light', value: '#27272a' },
];

const BG_PRESETS_PRO = [
  { label: 'White', value: '#ffffff' },
  { label: 'Cream', value: '#fef3c7' },
];

interface ControlsProps {
  text: string;
  setText: (v: string) => void;
  fontSize: number;
  setFontSize: (v: number) => void;
  letterSpacing: number;
  setLetterSpacing: (v: number) => void;
  lineHeight: number;
  setLineHeight: (v: number) => void;
  textColor: string;
  setTextColor: (v: string) => void;
  bgColor: string;
  setBgColor: (v: string) => void;
  search: string;
  setSearch: (v: string) => void;
  bold: boolean;
  setBold: (v: boolean) => void;
  italic: boolean;
  setItalic: (v: boolean) => void;
  uppercase: boolean;
  setUppercase: (v: boolean) => void;
  underline: boolean;
  setUnderline: (v: boolean) => void;
  textAlign: string;
  setTextAlign: (v: string) => void;
  isPro: boolean;
  searchInputRef?: React.RefObject<HTMLInputElement | null>;
}

function LockIcon({ className = 'h-3 w-3' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
      />
    </svg>
  );
}

export default function Controls({
  text,
  setText,
  fontSize,
  setFontSize,
  letterSpacing,
  setLetterSpacing,
  lineHeight,
  setLineHeight,
  textColor,
  setTextColor,
  bgColor,
  setBgColor,
  search,
  setSearch,
  bold,
  setBold,
  italic,
  setItalic,
  uppercase,
  setUppercase,
  underline,
  setUnderline,
  textAlign,
  setTextAlign,
  isPro,
  searchInputRef,
}: ControlsProps) {
  const [sampleKey, setSampleKey] = useState('Custom');

  const handleSampleChange = (key: string) => {
    setSampleKey(key);
    if (key !== 'Custom') {
      setText(SAMPLE_TEXTS[key]);
    }
  };

  const toggleButton = (
    label: string,
    active: boolean,
    onClick: () => void,
    proOnly: boolean
  ) => {
    const disabled = proOnly && !isPro;
    return (
      <button
        onClick={disabled ? undefined : onClick}
        className={`
          relative flex items-center justify-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors
          ${
            disabled
              ? 'bg-zinc-800/50 text-zinc-600 cursor-not-allowed'
              : active
              ? 'bg-violet-600 text-white'
              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
          }
        `}
        title={disabled ? 'Pro feature' : label}
      >
        {label}
        {disabled && <LockIcon className="h-3 w-3 text-zinc-600" />}
      </button>
    );
  };

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-xl bg-zinc-900/60 border border-zinc-800 p-3 sm:p-4">
      {/* Preview text input */}
      <div className="flex flex-col gap-1 min-w-[140px] sm:min-w-[200px] flex-1">
        <label className="text-xs text-zinc-500">Preview Text</label>
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setSampleKey('Custom');
          }}
          placeholder="Type preview text..."
          className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-200 placeholder-zinc-600 focus:border-violet-600 focus:outline-none focus:ring-1 focus:ring-violet-600"
        />
      </div>

      {/* Sample text dropdown */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-zinc-500">Sample</label>
        <select
          value={sampleKey}
          onChange={(e) => handleSampleChange(e.target.value)}
          className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-200 focus:border-violet-600 focus:outline-none"
        >
          {Object.keys(SAMPLE_TEXTS).map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>
      </div>

      {/* Search fonts */}
      <div className="flex flex-col gap-1 min-w-[120px] sm:min-w-[160px] flex-1 sm:flex-none">
        <label className="text-xs text-zinc-500">Search Fonts</label>
        <div className="relative">
          <svg
            className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <input
            ref={searchInputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 pl-8 pr-3 py-1.5 text-sm text-zinc-200 placeholder-zinc-600 focus:border-violet-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Font size slider */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-zinc-500">
          Size <span className="text-violet-400">{fontSize}px</span>
        </label>
        <input
          type="range"
          min={12}
          max={120}
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          className="w-28 accent-violet-600"
        />
      </div>

      {/* Letter spacing slider */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-zinc-500">
          Spacing <span className="text-violet-400">{letterSpacing}px</span>
        </label>
        <input
          type="range"
          min={-5}
          max={20}
          step={0.5}
          value={letterSpacing}
          onChange={(e) => setLetterSpacing(Number(e.target.value))}
          className="w-24 accent-violet-600"
        />
      </div>

      {/* Line height slider */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-zinc-500">
          Line Height <span className="text-violet-400">{lineHeight.toFixed(1)}</span>
        </label>
        <input
          type="range"
          min={0.8}
          max={3.0}
          step={0.1}
          value={lineHeight}
          onChange={(e) => setLineHeight(Number(e.target.value))}
          className="w-24 accent-violet-600"
        />
      </div>

      {/* Text color */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-zinc-500">Text Color</label>
        <input
          type="color"
          value={textColor}
          onChange={(e) => setTextColor(e.target.value)}
          className="h-8 w-8 cursor-pointer rounded border border-zinc-700 bg-transparent"
        />
      </div>

      {/* Background color */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-zinc-500">Background</label>
        <div className="flex items-center gap-1.5">
          {BG_PRESETS_FREE.map((p) => (
            <button
              key={p.value}
              onClick={() => setBgColor(p.value)}
              className={`h-7 w-7 rounded border-2 transition-colors ${
                bgColor === p.value ? 'border-violet-400' : 'border-zinc-700'
              }`}
              style={{ backgroundColor: p.value }}
              title={p.label}
            />
          ))}
          {BG_PRESETS_PRO.map((p) => (
            <button
              key={p.value}
              onClick={() => isPro && setBgColor(p.value)}
              className={`relative h-7 w-7 rounded border-2 transition-colors ${
                bgColor === p.value ? 'border-violet-400' : 'border-zinc-700'
              } ${!isPro ? 'opacity-40 cursor-not-allowed' : ''}`}
              style={{ backgroundColor: p.value }}
              title={isPro ? p.label : 'Pro only'}
            >
              {!isPro && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <LockIcon className="h-3 w-3 text-zinc-500" />
                </span>
              )}
            </button>
          ))}
          {isPro && (
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="h-7 w-7 cursor-pointer rounded border border-zinc-700 bg-transparent"
              title="Custom color"
            />
          )}
        </div>
      </div>

      {/* Style toggle buttons */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-zinc-500">Style</label>
        <div className="flex items-center gap-1">
          {toggleButton('B', bold, () => setBold(!bold), true)}
          {toggleButton('I', italic, () => setItalic(!italic), true)}
          {toggleButton('AA', uppercase, () => setUppercase(!uppercase), true)}
          {toggleButton('U', underline, () => setUnderline(!underline), true)}
        </div>
      </div>

      {/* Text alignment */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-zinc-500">Align</label>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setTextAlign('left')}
            className={`flex items-center justify-center rounded-lg px-3 py-1.5 transition-colors ${
              textAlign === 'left' ? 'bg-violet-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
            title="Align Left"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/></svg>
          </button>
          <button
            onClick={() => setTextAlign('center')}
            className={`flex items-center justify-center rounded-lg px-3 py-1.5 transition-colors ${
              textAlign === 'center' ? 'bg-violet-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
            title="Align Center"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
          </button>
          <button
            onClick={() => setTextAlign('right')}
            className={`flex items-center justify-center rounded-lg px-3 py-1.5 transition-colors ${
              textAlign === 'right' ? 'bg-violet-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
            title="Align Right"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="6" y1="18" x2="21" y2="18"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
