/**
 * Font classification utility — matches the desktop font_generator.html logic.
 * Used for style-based category filtering and font profiling.
 */

export type FontClass = 'serif' | 'sans-serif' | 'script' | 'display' | 'monospace' | 'monoline'

const KEYWORD_RULES: { kw: string[]; cls?: FontClass }[] = [
  { kw: ['monoline', 'single line', 'single-line', 'singleline', 'hairline', 'engraving', 'engrave', 'slf ', 'single stroke', 'one line', 'oneline', 'thin stroke', 'pen line', 'writing font'], cls: 'monoline' },
  { kw: ['mono', 'code', 'console', 'consol', 'terminal', 'courier', 'fira code', 'source code', 'jetbrains', 'menlo'], cls: 'monospace' },
  { kw: ['script', 'cursive', 'callig', 'hand', 'writing', 'handlee', 'finger', 'brush', 'paint', 'ink', 'dance', 'dancing', 'lobster', 'pacifico', 'satisfy', 'sacramento', 'caveat', 'kalam', 'patrick', 'wedding', 'love', 'heart', 'bridal'], cls: 'script' },
  { kw: ['display', 'poster', 'banner', 'headline', 'decorat', 'ornament', 'fancy', 'comic', 'cartoon', 'fun', 'playful', 'marker', 'chalk', 'crayon', 'sketch', 'stencil', 'military', 'slab', 'retro', 'vintage', 'classic', 'old', 'impact', 'cooper', 'playfair', 'abril', 'bebas', 'anton', 'oswald', 'righteous', 'bangers', 'fredoka'], cls: 'display' },
  { kw: ['garamond', 'caslon', 'jenson', 'baskerville', 'didot', 'bodoni', 'times', 'georgia', 'palatino', 'serif', 'roman', 'book', 'text', 'reading', 'merriweather', 'lora', 'crimson', 'libre baskerville', 'noto serif', 'source serif', 'pt serif', 'ibm plex serif', 'roboto slab', 'bitter', 'century', 'cambria'], cls: 'serif' },
  { kw: ['sans', 'helvetica', 'arial', 'futura', 'gothic', 'gill', 'verdana', 'tahoma', 'calibri', 'segoe', 'roboto', 'open sans', 'lato', 'montserrat', 'poppins', 'nunito', 'inter', 'raleway'], cls: 'sans-serif' },
]

/** Well-known monoline / single-line fonts — matched by name for reliable detection */
const KNOWN_MONOLINE_FONTS = [
  'slf casual', 'slf print', 'slf serif', 'slf sans', 'slf block',
  'halftone', 'hershey', 'cnc vector', 'single line',
  'orach technic', '1cam', 'machine tool', 'rhit',
  'emsign', 'routed gothic', 'amatic', 'amatic sc',
  'architects daughter', 'shadows into light', 'gloria hallelujah',
  'just another hand', 'indie flower', 'permanent marker',
  'nothing you could do', 'reenie beanie', 'coming soon',
  'homemade apple', 'rock salt', 'waiting for the sunrise',
  'la belle aurore', 'cedarville cursive', 'sue ellen francisco',
  'loved by the king', 'just me again down here',
  'annie use your telescope', 'the girl next door',
  'dawning of a new day', 'over the rainbow',
  'crafty girls', 'schoolbell',
]

/** Classify a font by name into one of 6 style categories. */
export function classifyFont(name: string): FontClass {
  const lower = name.toLowerCase()
  // Check known monoline fonts first
  if (KNOWN_MONOLINE_FONTS.some(mf => lower.includes(mf))) {
    return 'monoline'
  }
  for (const rule of KEYWORD_RULES) {
    if (rule.cls && rule.kw.some(kw => lower.includes(kw))) {
      return rule.cls
    }
  }
  return 'sans-serif'
}

/** Check if a font is monoline (single-line / writing font suitable for SVG export) */
export function isMonolineFont(name: string): boolean {
  return classifyFont(name) === 'monoline'
}

/** Human-readable label for each font class */
export const CLASS_LABELS: Record<FontClass, string> = {
  'monoline': 'Monoline',
  'serif': 'Serif',
  'sans-serif': 'Sans-Serif',
  'script': 'Handwritten',
  'display': 'Display',
  'monospace': 'Monospace',
}
