'use client';

import { useCallback, useRef, useState } from 'react';

interface UploadZoneProps {
  onUpload: (file: File) => Promise<boolean>;
  canUpload: boolean;
  isPro: boolean;
  fontCount: number;
  fontLimit: number;
}

const ACCEPTED_EXTENSIONS = ['.ttf', '.otf', '.woff', '.woff2'];
const ACCEPTED_MIME_TYPES = [
  'font/ttf',
  'font/otf',
  'font/woff',
  'font/woff2',
  'application/x-font-ttf',
  'application/x-font-otf',
  'application/font-woff',
  'application/font-woff2',
];

function isValidFontFile(file: File): boolean {
  const ext = '.' + file.name.split('.').pop()?.toLowerCase();
  return ACCEPTED_EXTENSIONS.includes(ext);
}

export default function UploadZone({
  onUpload,
  canUpload,
  isPro,
  fontCount,
  fontLimit,
}: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const validFiles = Array.from(files).filter(isValidFontFile);
      if (validFiles.length === 0) return;

      setIsUploading(true);
      for (const file of validFiles) {
        await onUpload(file);
      }
      setIsUploading(false);
    },
    [onUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (!canUpload) return;
      handleFiles(e.dataTransfer.files);
    },
    [canUpload, handleFiles]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (canUpload) setIsDragOver(true);
    },
    [canUpload]
  );

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleClick = () => {
    if (canUpload && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
      e.target.value = '';
    }
  };

  const progressPercent = fontLimit > 0 ? Math.min((fontCount / fontLimit) * 100, 100) : 0;

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={handleClick}
      className={`
        relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8
        transition-all duration-200 cursor-pointer
        ${
          !canUpload
            ? 'border-zinc-700 bg-zinc-900/50 cursor-not-allowed'
            : isDragOver
            ? 'border-violet-400 bg-violet-600/10 scale-[1.01]'
            : 'border-zinc-600 bg-zinc-900/30 hover:border-violet-600 hover:bg-zinc-900/50'
        }
      `}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_EXTENSIONS.join(',')}
        multiple
        onChange={handleInputChange}
        className="hidden"
      />

      {isUploading ? (
        <div className="flex flex-col items-center gap-3">
          <svg
            className="h-8 w-8 animate-spin text-violet-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <p className="text-sm text-zinc-400">Uploading fonts...</p>
        </div>
      ) : canUpload ? (
        <>
          <svg
            className="h-10 w-10 text-zinc-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          <p className="text-sm font-medium text-zinc-300">
            Drop fonts here or click to browse
          </p>
          <p className="text-xs text-zinc-500">
            Supports .ttf, .otf, .woff, .woff2
          </p>
        </>
      ) : (
        <div className="flex flex-col items-center gap-2 text-center">
          <svg
            className="h-8 w-8 text-violet-400"
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
          <p className="text-sm font-medium text-violet-300">
            Upgrade to Pro for unlimited fonts
          </p>
          <a
            href="/api/stripe/checkout"
            onClick={(e) => e.stopPropagation()}
            className="mt-1 rounded-lg bg-violet-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-violet-500 transition-colors"
          >
            Upgrade Now
          </a>
        </div>
      )}

      {/* Font count and progress */}
      <div className="mt-2 w-full max-w-xs">
        <div className="flex items-center justify-between text-xs text-zinc-500 mb-1">
          <span>
            {fontCount} / {isPro ? '\u221E' : fontLimit} fonts
          </span>
          {!isPro && <span>{Math.round(progressPercent)}%</span>}
        </div>
        {!isPro && (
          <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-violet-600 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
