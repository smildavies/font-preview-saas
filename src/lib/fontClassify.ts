/**
 * Font classification utility — matches the desktop font_generator.html logic.
 * Used for style-based category filtering and font profiling.
 */

export type FontClass = 'serif' | 'sans-serif' | 'script' | 'display' | 'monospace'

const KEYWORD_RULES: { kw: string[]; cls?: FontClass }[] = [
  { kw: ['mono', 'code', 'console', 'consol', 'terminal', 'courier', 'fira code', 'source code', 'jetbrains', 'menlo'], cls: 'monospace' },
  { kw: ['script', 'cursive', 'callig', 'hand', 'writing', 'handlee', 'finger', 'brush', 'paint', 'ink', 'dance', 'dancing', 'lobster', 'pacifico', 'satisfy', 'sacramento', 'caveat', 'kalam', 'patrick', 'wedding', 'love', 'heart', 'bridal'], cls: 'script' },
  { kw: ['display', 'poster', 'banner', 'headline', 'decorat', 'ornament', 'fancy', 'comic', 'cartoon', 'fun', 'playful', 'marker', 'chalk', 'crayon', 'sketch', 'stencil', 'military', 'slab', 'retro', 'vintage', 'classic', 'old', 'impact', 'cooper', 'playfair', 'abril', 'bebas', 'anton', 'oswald', 'righteous', 'bangers', 'fredoka'], cls: 'display' },
  { kw: ['garamond', 'caslon', 'jenson', 'baskerville', 'didot', 'bodoni', 'times', 'georgia', 'palatino', 'serif', 'roman', 'book', 'text', 'reading', 'merriweather', 'lora', 'crimson', 'libre baskerville', 'noto serif', 'source serif', 'pt serif', 'ibm plex serif', 'roboto slab', 'bitter', 'century', 'cambria'], cls: 'serif' },
  { kw: ['sans', 'helvetica', 'arial', 'futura', 'gothic', 'gill', 'verdana', 'tahoma', 'calibri', 'segoe', 'roboto', 'open sans', 'lato', 'montserrat', 'poppins', 'nunito', 'inter', 'raleway'], cls: 'sans-serif' },
]

/** Classify a font by name into one of 5 style categories. Matches desktop logic. */
export function classifyFont(name: string): FontClass {
  const lower = name.toLowerCase()
  for (const rule of KEYWORD_RULES) {
    if (rule.cls && rule.kw.some(kw => lower.includes(kw))) {
      return rule.cls
    }
  }
  return 'sans-serif'
}

/** Human-readable label for each font class */
export const CLASS_LABELS: Record<FontClass, string> = {
  'serif': 'Serif',
  'sans-serif': 'Sans-Serif',
  'script': 'Handwritten',
  'display': 'Display',
  'monospace': 'Monospace',
}
