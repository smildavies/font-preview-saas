/**
 * Font classification utility — uses multiple detection layers:
 * 1. Google Fonts API category (authoritative for Google fonts)
 * 2. Canvas-based visual/metric analysis (works for any rendered font)
 * 3. Name-based keyword fallback
 */

export type FontClass = 'serif' | 'sans-serif' | 'script' | 'display' | 'monospace' | 'monoline'

// ── Google category mapping ──────────────────────────────────────────
// Google Fonts API returns: serif, sans-serif, display, handwriting, monospace
const GOOGLE_CATEGORY_MAP: Record<string, FontClass> = {
  'serif': 'serif',
  'sans-serif': 'sans-serif',
  'display': 'display',
  'handwriting': 'script',
  'monospace': 'monospace',
}

// ── Known monoline fonts (override everything — these are writing/engraving fonts) ──
const KNOWN_MONOLINE_FONTS = [
  'slf casual', 'slf print', 'slf serif', 'slf sans', 'slf block',
  'halftone', 'hershey', 'cnc vector', 'single line',
  'orach technic', '1cam', 'machine tool', 'rhit',
  'emsign', 'routed gothic',
  'amatic', 'amatic sc', 'architects daughter', 'shadows into light',
  'gloria hallelujah', 'just another hand', 'indie flower',
  'permanent marker', 'nothing you could do', 'reenie beanie',
  'coming soon', 'homemade apple', 'rock salt',
  'waiting for the sunrise', 'la belle aurore', 'cedarville cursive',
  'sue ellen francisco', 'loved by the king', 'just me again down here',
  'annie use your telescope', 'the girl next door',
  'dawning of a new day', 'over the rainbow',
  'crafty girls', 'schoolbell',
  'caveat', 'kalam', 'patrick hand', 'handlee',
  'sedgwick ave', 'gochi hand', 'short stack',
  'walter turncoat', 'swanky and moo moo', 'sunshiney',
  'mrs sheppards', 'give you glory', 'fondamento',
  'covered by your grace', 'kranky', 'jolly lodger',
  'league script', 'pecita', 'daniel',
]

const MONOLINE_KEYWORDS = ['monoline', 'single line', 'single-line', 'singleline', 'engraving', 'engrave', 'slf ', 'single stroke', 'one line', 'oneline', 'pen line', 'writing font']

// ── Name-based keyword rules (last resort fallback) ──────────────────
const KEYWORD_RULES: { kw: string[]; cls: FontClass }[] = [
  { kw: ['mono', 'code', 'console', 'consol', 'terminal', 'courier', 'fira code', 'source code', 'jetbrains', 'menlo'], cls: 'monospace' },
  { kw: ['script', 'cursive', 'callig', 'brush', 'paint', 'ink', 'dance', 'dancing', 'lobster', 'pacifico', 'satisfy', 'sacramento', 'roundhand', 'snell', 'zapfino', 'lucida handwriting', 'segoe script', 'palace script', 'edwardian'], cls: 'script' },
  { kw: ['display', 'poster', 'banner', 'headline', 'decorat', 'ornament', 'fancy', 'comic', 'cartoon', 'stencil', 'impact', 'cooper', 'playfair', 'abril', 'bebas', 'anton', 'oswald', 'righteous', 'bangers', 'fredoka'], cls: 'display' },
  { kw: ['garamond', 'caslon', 'jenson', 'baskerville', 'didot', 'bodoni', 'times', 'georgia', 'palatino', 'serif', 'roman', 'merriweather', 'lora', 'crimson', 'noto serif', 'source serif', 'pt serif', 'ibm plex serif', 'roboto slab', 'bitter', 'century', 'cambria'], cls: 'serif' },
  { kw: ['helvetica', 'arial', 'futura', 'gothic', 'gill', 'verdana', 'tahoma', 'calibri', 'segoe', 'roboto', 'open sans', 'lato', 'montserrat', 'poppins', 'nunito', 'inter', 'raleway'], cls: 'sans-serif' },
]

// ── Canvas-based visual classification ───────────────────────────────
// Cache results to avoid re-measuring the same font repeatedly
const visualCache = new Map<string, FontClass>()
let sharedCanvas: HTMLCanvasElement | null = null
let sharedCtx: CanvasRenderingContext2D | null = null

function getCanvas(): CanvasRenderingContext2D | null {
  if (typeof document === 'undefined') return null
  if (!sharedCanvas) {
    sharedCanvas = document.createElement('canvas')
    sharedCanvas.width = 200
    sharedCanvas.height = 100
    sharedCtx = sharedCanvas.getContext('2d', { willReadFrequently: true })
  }
  return sharedCtx
}

function measureWidth(ctx: CanvasRenderingContext2D, text: string, fontFamily: string, size: number): number {
  ctx.font = `${size}px "${fontFamily}", sans-serif`
  return ctx.measureText(text).width
}

function getRowCounts(ctx: CanvasRenderingContext2D, char: string, fontFamily: string, fontSize: number): { y: number; count: number }[] {
  const canvas = ctx.canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = '#000'
  ctx.font = `${fontSize}px "${fontFamily}", sans-serif`
  ctx.fillText(char, 10, 70)
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data
  const rows: { y: number; count: number }[] = []
  for (let y = 0; y < canvas.height; y++) {
    let count = 0
    for (let x = 0; x < canvas.width; x++) {
      if (data[(y * canvas.width + x) * 4 + 3] > 100) count++
    }
    if (count > 0) rows.push({ y, count })
  }
  return rows
}

function getInkArea(ctx: CanvasRenderingContext2D, char: string, fontFamily: string, fontSize: number): number {
  const canvas = ctx.canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = '#000'
  ctx.font = `${fontSize}px "${fontFamily}", sans-serif`
  ctx.fillText(char, 10, 70)
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data
  let total = 0
  for (let i = 3; i < data.length; i += 4) if (data[i] > 100) total++
  return total
}

/**
 * Visually classify a font using canvas measurements.
 * Detects monospace, serif, sans-serif, script, display, and monoline.
 */
export function classifyByVisual(fontFamily: string): FontClass | null {
  if (visualCache.has(fontFamily)) return visualCache.get(fontFamily)!

  const ctx = getCanvas()
  if (!ctx) return null

  const size = 48

  // 1. Monospace: narrow and wide chars should have same width
  const iWidth = measureWidth(ctx, 'iiiiii', fontFamily, size)
  const mWidth = measureWidth(ctx, 'MMMMMM', fontFamily, size)
  if (mWidth > 0 && iWidth / mWidth > 0.85) {
    visualCache.set(fontFamily, 'monospace')
    return 'monospace'
  }

  // 2. Serif detection via pixel analysis of lowercase 'l'
  const lRows = getRowCounts(ctx, 'l', fontFamily, 60)
  let hasSerifs = false
  if (lRows.length >= 5) {
    const bot3 = lRows.slice(-3).reduce((s, r) => s + r.count, 0) / 3
    const top3 = lRows.slice(0, 3).reduce((s, r) => s + r.count, 0) / 3
    const midIdx = Math.floor(lRows.length / 2)
    const mid3 = lRows.slice(midIdx - 1, midIdx + 2).reduce((s, r) => s + r.count, 0) / 3
    if (mid3 > 0) {
      hasSerifs = (bot3 / mid3) > 1.4 || (top3 / mid3) > 1.4
    }
  }

  // 3. Script detection — multiple signals
  const normalWidth = measureWidth(ctx, 'abcdefg', fontFamily, size)
  const sansRef = measureWidth(ctx, 'abcdefg', 'Arial', size)
  const widthRatio = sansRef > 0 ? normalWidth / sansRef : 1

  // Italic invariance (script fonts are already slanted)
  ctx.font = `italic ${size}px "${fontFamily}", sans-serif`
  const italicWidth = ctx.measureText('abcdefg').width
  ctx.font = `${size}px "${fontFamily}", sans-serif`
  const italicRatio = normalWidth > 0 ? italicWidth / normalWidth : 1
  const italicInvariant = italicRatio > 0.95 && italicRatio < 1.05

  // Descender variance — script fonts have varying descenders
  const metricsP = ctx.measureText('p')
  const metricsX = ctx.measureText('x')
  const metricsG = ctx.measureText('g')
  const descP = metricsP.actualBoundingBoxDescent || 0
  const descX = metricsX.actualBoundingBoxDescent || 0
  const descG = metricsG.actualBoundingBoxDescent || 0
  const ascH = metricsP.actualBoundingBoxAscent || size
  const descVariance = Math.max(descP, descG) - descX
  const hasLongDescenders = ascH > 0 && (descVariance / ascH) > 0.15

  const isScript = (widthRatio > 1.2 && italicInvariant) ||
                   (widthRatio > 1.15 && hasLongDescenders) ||
                   (italicInvariant && hasLongDescenders && widthRatio > 1.0)

  if (isScript && !hasSerifs) {
    visualCache.set(fontFamily, 'script')
    return 'script'
  }

  // 4. Display detection — very heavy stroke weight
  const lInk = getInkArea(ctx, 'l', fontFamily, 60)
  const lBboxH = lRows.length
  const avgStrokeWidth = lBboxH > 0 ? lInk / lBboxH : 0
  if (avgStrokeWidth > 12 && !hasSerifs) {
    visualCache.set(fontFamily, 'display')
    return 'display'
  }

  // 5. Monoline hint — very thin, uniform strokes
  if (lRows.length >= 5) {
    const strokeWidths = lRows.map(r => r.count)
    const midWidths = strokeWidths.slice(2, -2)
    if (midWidths.length > 3) {
      const avg = midWidths.reduce((a, b) => a + b, 0) / midWidths.length
      const variance = midWidths.reduce((s, w) => s + Math.pow(w - avg, 2), 0) / midWidths.length
      if (avg <= 4 && variance < 1.0 && !hasSerifs) {
        visualCache.set(fontFamily, 'monoline')
        return 'monoline'
      }
    }
  }

  const result: FontClass = hasSerifs ? 'serif' : 'sans-serif'
  visualCache.set(fontFamily, result)
  return result
}

// ── Main classification function ─────────────────────────────────────

/**
 * Classify a font using all available data:
 * @param name - Font family or full name
 * @param googleCategory - Category from Google Fonts API (if available)
 * @param useVisual - Whether to attempt canvas-based detection (default true)
 */
export function classifyFont(name: string, googleCategory?: string, useVisual: boolean = true): FontClass {
  const lower = name.toLowerCase()

  // Layer 0: Known monoline fonts always win
  if (KNOWN_MONOLINE_FONTS.some(mf => lower.includes(mf))) {
    return 'monoline'
  }
  if (MONOLINE_KEYWORDS.some(kw => lower.includes(kw))) {
    return 'monoline'
  }

  // Layer 1: Google Fonts API category (authoritative for Google fonts)
  if (googleCategory) {
    const mapped = GOOGLE_CATEGORY_MAP[googleCategory.toLowerCase()]
    if (mapped) return mapped
  }

  // Layer 2: Canvas-based visual detection
  if (useVisual) {
    const visual = classifyByVisual(name)
    if (visual) return visual
  }

  // Layer 3: Name-based keyword fallback
  for (const rule of KEYWORD_RULES) {
    if (rule.kw.some(kw => lower.includes(kw))) {
      return rule.cls
    }
  }

  return 'sans-serif'
}

/** Check if a font is monoline */
export function isMonolineFont(name: string, googleCategory?: string): boolean {
  return classifyFont(name, googleCategory) === 'monoline'
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
