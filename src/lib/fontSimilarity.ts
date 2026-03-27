export interface FontMetrics {
  avgWidth: number;
  capsHeight: number;
  widthRatio: number;
  isSerif: boolean;
  isMonospace: boolean;
}

export interface SimilarResult {
  font: string;
  score: number;
  reason: string;
}

let metricsCache: Map<string, FontMetrics> = new Map();

export function clearMetricsCache(): void {
  metricsCache = new Map();
}

export function measureFontMetrics(fontFamily: string): FontMetrics {
  const cached = metricsCache.get(fontFamily);
  if (cached) return cached;

  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 200;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    const fallback: FontMetrics = { avgWidth: 10, capsHeight: 14, widthRatio: 3, isSerif: false, isMonospace: false };
    metricsCache.set(fontFamily, fallback);
    return fallback;
  }

  const fontSize = 72;
  const fontStr = `${fontSize}px "${fontFamily}", sans-serif`;
  ctx.font = fontStr;

  // Average character width across a representative string
  const testChars = 'abcdefghijklmnopqrstuvwxyz';
  let totalWidth = 0;
  for (const ch of testChars) {
    totalWidth += ctx.measureText(ch).width;
  }
  const avgWidth = totalWidth / testChars.length;

  // Uppercase / caps height approximation via metric width of capital letters
  const capsString = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let capsTotal = 0;
  for (const ch of capsString) {
    capsTotal += ctx.measureText(ch).width;
  }
  const capsHeight = capsTotal / capsString.length;

  // Width ratio: widest char vs narrowest common char
  const wWidth = ctx.measureText('W').width;
  const iWidth = ctx.measureText('i').width;
  const widthRatio = iWidth > 0 ? wWidth / iWidth : 3;

  // Monospace detection: compare widths of 'i' and 'M'
  const mWidth = ctx.measureText('M').width;
  const isMonospace = Math.abs(mWidth - iWidth) < 2;

  // Serif heuristic: compare 'I' rendered width with a known sans-serif baseline
  // Serifs on 'I' make it slightly wider compared to a sans reference
  ctx.font = `${fontSize}px "${fontFamily}", sans-serif`;
  const fontIWidth = ctx.measureText('I').width;
  ctx.font = `${fontSize}px Arial, sans-serif`;
  const arialIWidth = ctx.measureText('I').width;
  // Also check 'l' for serif indicators
  ctx.font = `${fontSize}px "${fontFamily}", sans-serif`;
  const fontLWidth = ctx.measureText('l').width;
  ctx.font = `${fontSize}px Arial, sans-serif`;
  const arialLWidth = ctx.measureText('l').width;

  // If the font's I or l is notably wider than Arial's, it likely has serifs
  const iDiff = Math.abs(fontIWidth - arialIWidth) / arialIWidth;
  const lDiff = Math.abs(fontLWidth - arialLWidth) / arialLWidth;
  const isSerif = iDiff > 0.08 || lDiff > 0.08;

  const metrics: FontMetrics = {
    avgWidth,
    capsHeight,
    widthRatio,
    isSerif,
    isMonospace,
  };

  metricsCache.set(fontFamily, metrics);
  return metrics;
}

function computeSimilarityScore(a: FontMetrics, b: FontMetrics): number {
  // Weighted comparison of normalized metrics
  const weights = {
    avgWidth: 0.25,
    capsHeight: 0.2,
    widthRatio: 0.2,
    serifMatch: 0.2,
    monoMatch: 0.15,
  };

  // Normalize differences to 0-1 range (0 = identical, 1 = very different)
  const avgWidthDiff = Math.abs(a.avgWidth - b.avgWidth) / Math.max(a.avgWidth, b.avgWidth, 1);
  const capsHeightDiff = Math.abs(a.capsHeight - b.capsHeight) / Math.max(a.capsHeight, b.capsHeight, 1);
  const widthRatioDiff = Math.abs(a.widthRatio - b.widthRatio) / Math.max(a.widthRatio, b.widthRatio, 1);
  const serifMatch = a.isSerif === b.isSerif ? 0 : 1;
  const monoMatch = a.isMonospace === b.isMonospace ? 0 : 1;

  const totalDiff =
    avgWidthDiff * weights.avgWidth +
    capsHeightDiff * weights.capsHeight +
    widthRatioDiff * weights.widthRatio +
    serifMatch * weights.serifMatch +
    monoMatch * weights.monoMatch;

  // Convert to 0-100 score where 100 = identical
  return Math.round(Math.max(0, Math.min(100, (1 - totalDiff) * 100)));
}

function generateReason(targetMetrics: FontMetrics, candidateMetrics: FontMetrics, score: number): string {
  const traits: string[] = [];

  const avgWidthDiff = Math.abs(targetMetrics.avgWidth - candidateMetrics.avgWidth) / Math.max(targetMetrics.avgWidth, 1);
  const capsHeightDiff = Math.abs(targetMetrics.capsHeight - candidateMetrics.capsHeight) / Math.max(targetMetrics.capsHeight, 1);

  if (avgWidthDiff < 0.05 && capsHeightDiff < 0.05) {
    traits.push('Nearly identical proportions');
  } else if (avgWidthDiff < 0.1) {
    traits.push('Similar proportions');
  }

  if (capsHeightDiff < 0.05) {
    traits.push('matching x-height');
  }

  if (targetMetrics.isSerif === candidateMetrics.isSerif) {
    traits.push(targetMetrics.isSerif ? 'serif style' : 'sans-serif style');
  }

  if (targetMetrics.isMonospace && candidateMetrics.isMonospace) {
    traits.push('monospace width');
  }

  const widthRatioDiff = Math.abs(targetMetrics.widthRatio - candidateMetrics.widthRatio);
  if (widthRatioDiff < 0.3) {
    traits.push('similar character spacing');
  }

  if (traits.length === 0) {
    if (score > 80) return 'Very close overall metrics';
    if (score > 60) return 'Comparable typographic characteristics';
    return 'Partial metric similarity';
  }

  // Capitalize first trait and join
  const result = traits.slice(0, 3).join(' and ');
  return result.charAt(0).toUpperCase() + result.slice(1);
}

export function findSimilarFonts(
  targetFont: string,
  allFonts: string[],
  limit: number = 8,
): SimilarResult[] {
  const targetMetrics = measureFontMetrics(targetFont);

  const results: SimilarResult[] = [];

  for (const font of allFonts) {
    if (font === targetFont) continue;

    const metrics = measureFontMetrics(font);
    const score = computeSimilarityScore(targetMetrics, metrics);

    results.push({
      font,
      score,
      reason: generateReason(targetMetrics, metrics, score),
    });
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);

  return results.slice(0, limit);
}
