'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface Font {
  id: string;
  name: string;
  format: string;
  file_size: number;
  familyId: string;
  fontUrl: string;
  storage_path: string;
}

interface FontCardProps {
  font: Font;
  previewText: string;
  fontSize: number;
  letterSpacing: number;
  lineHeight: number;
  textColor: string;
  bgColor: string;
  bold: boolean;
  italic: boolean;
  uppercase: boolean;
  underline: boolean;
  isPro: boolean;
  onDelete: (id: string) => void;
  onCompare: (font: Font) => void;
  onGlyphs: (font: Font) => void;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

export default function FontCard({
  font,
  previewText,
  fontSize,
  letterSpacing,
  lineHeight,
  textColor,
  bgColor,
  bold,
  italic,
  uppercase,
  underline,
  isPro,
  onDelete,
  onCompare,
  onGlyphs,
}: FontCardProps) {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const fontFamilyName = `font-${font.familyId}`;

  useEffect(() => {
    let cancelled = false;
    const loadFont = async () => {
      try {
        const face = new FontFace(fontFamilyName, `url(${font.fontUrl})`);
        const loaded = await face.load();
        if (!cancelled) {
          document.fonts.add(loaded);
          setFontLoaded(true);
        }
      } catch (err) {
        console.error('Failed to load font:', font.name, err);
      }
    };
    loadFont();
    return () => {
      cancelled = true;
    };
  }, [font.fontUrl, font.familyId, fontFamilyName, font.name]);

  const copyToClipboard = useCallback(async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 1500);
  }, []);

  const handleCopyName = () => {
    copyToClipboard(font.name, 'name');
  };

  const handleCopyCSS = () => {
    const css = `font-family: '${font.name}';\nfont-size: ${fontSize}px;\nletter-spacing: ${letterSpacing}px;\nline-height: ${lineHeight};`;
    copyToClipboard(css, 'css');
  };

  const handleExportPNG = async () => {
    {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      canvas.width = 1200;
      canvas.height = 400;
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // Font label
      ctx.fillStyle = '#a78bfa';
      ctx.font = '20px -apple-system, sans-serif';
      ctx.fillText(`${font.name}  (${font.format})`, 40, 40);
      // Preview text
      ctx.fillStyle = textColor;
      ctx.font = `${italic ? 'italic ' : ''}${bold ? 'bold ' : ''}${fontSize}px "${fontFamilyName}", sans-serif`;
      const words = (previewText || font.name).split(' ');
      let line = '';
      let y = 120;
      const lh = lineHeight * fontSize;
      for (const word of words) {
        const test = line + word + ' ';
        if (ctx.measureText(test).width > 1120 && line) {
          ctx.fillText(line.trim(), 40, y);
          line = word + ' ';
          y += lh;
        } else {
          line = test;
        }
      }
      ctx.fillText(line.trim(), 40, y);
      const link = document.createElement('a');
      link.download = `${font.name}-preview.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  const formatBadgeColor: Record<string, string> = {
    ttf: 'bg-blue-900/50 text-blue-400',
    otf: 'bg-emerald-900/50 text-emerald-400',
    woff: 'bg-amber-900/50 text-amber-400',
    woff2: 'bg-purple-900/50 text-purple-400',
  };

  return (
    <div className="group rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden transition-all hover:border-zinc-700">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-zinc-800 px-4 py-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={handleCopyName}
            className="truncate text-sm font-medium text-zinc-200 hover:text-violet-400 transition-colors"
            title="Click to copy font name"
          >
            {font.name}
          </button>
          {copied === 'name' && (
            <span className="text-xs text-violet-400 animate-pulse">Copied!</span>
          )}
          <span
            className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-mono uppercase ${
              formatBadgeColor[font.format] || 'bg-zinc-800 text-zinc-400'
            }`}
          >
            {font.format}
          </span>
          <span className="shrink-0 text-[10px] text-zinc-600">
            {formatFileSize(font.file_size)}
          </span>
        </div>
        <button
          onClick={() => onDelete(font.id)}
          className="shrink-0 rounded p-1 text-zinc-600 hover:bg-red-900/30 hover:text-red-400 transition-colors"
          title="Delete font"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </svg>
        </button>
      </div>

      {/* Preview */}
      <div
        ref={previewRef}
        className="min-h-[120px] px-4 py-6 overflow-hidden transition-colors"
        style={{ backgroundColor: bgColor }}
      >
        {fontLoaded ? (
          <p
            style={{
              fontFamily: `"${fontFamilyName}", sans-serif`,
              fontSize: `${fontSize}px`,
              letterSpacing: `${letterSpacing}px`,
              lineHeight,
              color: textColor,
              fontWeight: bold ? 'bold' : 'normal',
              fontStyle: italic ? 'italic' : 'normal',
              textTransform: uppercase ? 'uppercase' : 'none',
              textDecoration: underline ? 'underline' : 'none',
              wordBreak: 'break-word',
            }}
          >
            {previewText || font.name}
          </p>
        ) : (
          <div className="flex items-center gap-2 text-zinc-600 text-sm">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading font...
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 border-t border-zinc-800 px-3 py-2">
        <button
          onClick={handleCopyCSS}
          className="rounded-lg px-2.5 py-1 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
        >
          {copied === 'css' ? 'Copied!' : 'Copy CSS'}
        </button>

        <button
          onClick={() => isPro && onGlyphs(font)}
          className={`rounded-lg px-2.5 py-1 text-xs transition-colors ${
            isPro
              ? 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
              : 'text-zinc-600 cursor-not-allowed'
          }`}
          title={isPro ? 'View glyphs' : 'Pro feature'}
        >
          Glyphs
          {!isPro && (
            <svg className="ml-1 inline h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          )}
        </button>

        <button
          onClick={() => isPro && onCompare(font)}
          className={`rounded-lg px-2.5 py-1 text-xs transition-colors ${
            isPro
              ? 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
              : 'text-zinc-600 cursor-not-allowed'
          }`}
          title={isPro ? 'Compare' : 'Pro feature'}
        >
          Compare
          {!isPro && (
            <svg className="ml-1 inline h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          )}
        </button>

        <button
          onClick={() => isPro && handleExportPNG()}
          className={`rounded-lg px-2.5 py-1 text-xs transition-colors ${
            isPro
              ? 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
              : 'text-zinc-600 cursor-not-allowed'
          }`}
          title={isPro ? 'Export PNG' : 'Pro feature'}
        >
          Export PNG
          {!isPro && (
            <svg className="ml-1 inline h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
