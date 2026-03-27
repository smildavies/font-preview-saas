'use client';

import FontCard from './FontCard';

interface Font {
  id: string;
  name: string;
  format: string;
  file_size: number;
  familyId: string;
  fontUrl: string;
  storage_path: string;
}

interface PreviewSettings {
  text: string;
  fontSize: number;
  letterSpacing: number;
  lineHeight: number;
  textColor: string;
  bgColor: string;
  bold: boolean;
  italic: boolean;
  uppercase: boolean;
  underline: boolean;
}

interface FontGridProps {
  fonts: Font[];
  previewSettings: PreviewSettings;
  isPro: boolean;
  onDelete: (id: string) => void;
  onCompare: (font: Font) => void;
  onGlyphs: (font: Font) => void;
}

export default function FontGrid({
  fonts,
  previewSettings,
  isPro,
  onDelete,
  onCompare,
  onGlyphs,
}: FontGridProps) {
  if (fonts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-zinc-800 py-20">
        <svg
          className="h-16 w-16 text-zinc-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776"
          />
        </svg>
        <div className="text-center">
          <p className="text-sm font-medium text-zinc-400">No fonts yet</p>
          <p className="mt-1 text-xs text-zinc-600">
            Upload your first font to start previewing
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-3 text-xs text-zinc-500">
        Showing {fonts.length} font{fonts.length !== 1 ? 's' : ''}
      </p>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {fonts.map((font) => (
          <FontCard
            key={font.id}
            font={font}
            previewText={previewSettings.text}
            fontSize={previewSettings.fontSize}
            letterSpacing={previewSettings.letterSpacing}
            lineHeight={previewSettings.lineHeight}
            textColor={previewSettings.textColor}
            bgColor={previewSettings.bgColor}
            bold={previewSettings.bold}
            italic={previewSettings.italic}
            uppercase={previewSettings.uppercase}
            underline={previewSettings.underline}
            isPro={isPro}
            onDelete={onDelete}
            onCompare={onCompare}
            onGlyphs={onGlyphs}
          />
        ))}
      </div>
    </div>
  );
}
