export type FontClassification = 'serif' | 'sans-serif' | 'monospace' | 'script' | 'display';

export interface PairingResult {
  font: string;
  role: 'heading' | 'body';
  reason: string;
}

// Map of 100+ common fonts to their classifications
const FONT_CLASSIFICATION_MAP: Record<string, FontClassification> = {
  // Sans-Serif
  'Arial': 'sans-serif',
  'Arial Black': 'sans-serif',
  'Arial Narrow': 'sans-serif',
  'Arial Rounded MT Bold': 'sans-serif',
  'Avenir': 'sans-serif',
  'Avenir Next': 'sans-serif',
  'Avenir Next Condensed': 'sans-serif',
  'Calibri': 'sans-serif',
  'Candara': 'sans-serif',
  'Century Gothic': 'sans-serif',
  'Corbel': 'sans-serif',
  'DIN Alternate': 'sans-serif',
  'DIN Condensed': 'sans-serif',
  'DIN': 'sans-serif',
  'Futura': 'sans-serif',
  'Futura PT': 'sans-serif',
  'Geneva': 'sans-serif',
  'Gill Sans': 'sans-serif',
  'Gotham': 'sans-serif',
  'Helvetica': 'sans-serif',
  'Helvetica Neue': 'sans-serif',
  'Helvetica LT': 'sans-serif',
  'Impact': 'sans-serif',
  'Inter': 'sans-serif',
  'Lucida Grande': 'sans-serif',
  'Lucida Sans Unicode': 'sans-serif',
  'Microsoft Sans Serif': 'sans-serif',
  'MS Sans Serif': 'sans-serif',
  'Optima': 'sans-serif',
  'San Francisco': 'sans-serif',
  'Segoe UI': 'sans-serif',
  'Segoe UI Light': 'sans-serif',
  'Segoe UI Semibold': 'sans-serif',
  'Tahoma': 'sans-serif',
  'Trebuchet MS': 'sans-serif',
  'Univers': 'sans-serif',
  'Verdana': 'sans-serif',
  'Frutiger': 'sans-serif',
  'Akzidenz Grotesk': 'sans-serif',
  'Trade Gothic': 'sans-serif',
  'News Gothic': 'sans-serif',
  'Franklin Gothic': 'sans-serif',
  'Franklin Gothic Medium': 'sans-serif',
  'Proxima Nova': 'sans-serif',
  'Brandon Grotesque': 'sans-serif',
  'Myriad Pro': 'sans-serif',
  'Aptos': 'sans-serif',
  'Bahnschrift': 'sans-serif',
  'Ebrima': 'sans-serif',
  'Gadugi': 'sans-serif',
  'Leelawadee UI': 'sans-serif',
  'Nirmala UI': 'sans-serif',
  'Malgun Gothic': 'sans-serif',
  // Google Sans-Serif
  'Roboto': 'sans-serif',
  'Open Sans': 'sans-serif',
  'Lato': 'sans-serif',
  'Montserrat': 'sans-serif',
  'Oswald': 'sans-serif',
  'Raleway': 'sans-serif',
  'Poppins': 'sans-serif',
  'Noto Sans': 'sans-serif',
  'Ubuntu': 'sans-serif',
  'Nunito': 'sans-serif',
  'Nunito Sans': 'sans-serif',
  'Source Sans Pro': 'sans-serif',
  'Fira Sans': 'sans-serif',
  'Work Sans': 'sans-serif',
  'Quicksand': 'sans-serif',
  'Barlow': 'sans-serif',
  'Rubik': 'sans-serif',
  'Karla': 'sans-serif',
  'Josefin Sans': 'sans-serif',
  'Cabin': 'sans-serif',
  'Catamaran': 'sans-serif',
  'Exo 2': 'sans-serif',
  'Archivo': 'sans-serif',
  'Archivo Narrow': 'sans-serif',
  'Asap': 'sans-serif',
  'Dosis': 'sans-serif',
  'Encode Sans': 'sans-serif',
  'Heebo': 'sans-serif',
  'Hind': 'sans-serif',
  'IBM Plex Sans': 'sans-serif',
  'Kanit': 'sans-serif',
  'Libre Franklin': 'sans-serif',
  'Maven Pro': 'sans-serif',
  'Mukta': 'sans-serif',
  'Nanum Gothic': 'sans-serif',
  'Overpass': 'sans-serif',
  'Oxygen': 'sans-serif',
  'Play': 'sans-serif',
  'Prompt': 'sans-serif',
  'Questrial': 'sans-serif',
  'Rajdhani': 'sans-serif',
  'Sarabun': 'sans-serif',
  'Signika': 'sans-serif',
  'Teko': 'sans-serif',
  'Titillium Web': 'sans-serif',
  'Varela Round': 'sans-serif',
  'PT Sans': 'sans-serif',

  // Serif
  'American Typewriter': 'serif',
  'Baskerville': 'serif',
  'Big Caslon': 'serif',
  'Bodoni 72': 'serif',
  'Bodoni 72 Oldstyle': 'serif',
  'Bodoni 72 Smallcaps': 'serif',
  'Book Antiqua': 'serif',
  'Bookman Old Style': 'serif',
  'Cambria': 'serif',
  'Century': 'serif',
  'Century Schoolbook': 'serif',
  'Charter': 'serif',
  'Cochin': 'serif',
  'Constantia': 'serif',
  'Didot': 'serif',
  'Georgia': 'serif',
  'Hoefler Text': 'serif',
  'MS Serif': 'serif',
  'Palatino': 'serif',
  'Palatino Linotype': 'serif',
  'Rockwell': 'serif',
  'STIXGeneral': 'serif',
  'Sylfaen': 'serif',
  'Times': 'serif',
  'Times New Roman': 'serif',
  'Garamond': 'serif',
  'Adobe Caslon Pro': 'serif',
  'Adobe Garamond Pro': 'serif',
  'Minion Pro': 'serif',
  'Sitka Text': 'serif',
  // Google Serif
  'Playfair Display': 'serif',
  'Merriweather': 'serif',
  'PT Serif': 'serif',
  'Source Serif Pro': 'serif',
  'Libre Baskerville': 'serif',
  'Crimson Text': 'serif',
  'Cormorant Garamond': 'serif',
  'EB Garamond': 'serif',
  'Bitter': 'serif',
  'Arvo': 'serif',
  'Josefin Slab': 'serif',
  'Cardo': 'serif',
  'Cinzel': 'serif',
  'IBM Plex Serif': 'serif',
  'Noto Serif': 'serif',
  'Philosopher': 'serif',
  'Rokkitt': 'serif',
  'Spectral': 'serif',
  'Zilla Slab': 'serif',

  // Monospace
  'Andale Mono': 'monospace',
  'Consolas': 'monospace',
  'Courier': 'monospace',
  'Courier New': 'monospace',
  'Lucida Console': 'monospace',
  'Menlo': 'monospace',
  'Monaco': 'monospace',
  'Source Code Pro': 'monospace',
  'Fira Code': 'monospace',
  'Inconsolata': 'monospace',
  'IBM Plex Mono': 'monospace',
  'Cascadia Code': 'monospace',
  'Cascadia Mono': 'monospace',

  // Script / Handwriting
  'Bradley Hand': 'script',
  'Brush Script MT': 'script',
  'Luminari': 'script',
  'Savoye LET': 'script',
  'SignPainter': 'script',
  'Snell Roundhand': 'script',
  'Zapfino': 'script',
  'Segoe Print': 'script',
  'Segoe Script': 'script',
  'Lucida Calligraphy': 'script',
  'Lucida Handwriting': 'script',
  'MV Boli': 'script',
  'Dancing Script': 'script',
  'Great Vibes': 'script',
  'Indie Flower': 'script',
  'Lobster': 'script',
  'Lobster Two': 'script',
  'Merienda': 'script',
  'Pacifico': 'script',
  'Sacramento': 'script',
  'Satisfy': 'script',
  'Shadows Into Light': 'script',
  'Tangerine': 'script',
  'Comfortaa': 'script',

  // Display / Decorative
  'Chalkboard': 'display',
  'Chalkboard SE': 'display',
  'Chalkduster': 'display',
  'Copperplate': 'display',
  'Herculanum': 'display',
  'Marker Felt': 'display',
  'Noteworthy': 'display',
  'Papyrus': 'display',
  'Phosphate': 'display',
  'Skia': 'display',
  'Comic Sans MS': 'display',
  'Comic Sans': 'display',
  'Gabriola': 'display',
  'Forte': 'display',
  'Harrington': 'display',
  'Magneto': 'display',
  'Maiandra GD': 'display',
  'Ravie': 'display',
  'Showcard Gothic': 'display',
  'Snap ITC': 'display',
  'Stencil': 'display',
  'Permanent Marker': 'display',
  'Titan One': 'display',
  'Abril Fatface': 'display',
  'Alfa Slab One': 'display',
  'Anton': 'display',
  'Archivo Black': 'display',
  'Bebas Neue': 'display',
  'Fjalla One': 'display',
  'Righteous': 'display',
  'Yanone Kaffeesatz': 'display',
};

// Keyword-based fallback classification
const CLASSIFICATION_KEYWORDS: { keywords: string[]; classification: FontClassification }[] = [
  { keywords: ['mono', 'code', 'console', 'terminal', 'courier'], classification: 'monospace' },
  { keywords: ['script', 'hand', 'cursive', 'calligraph', 'brush', 'writing', 'dance', 'lobster', 'pacifico'], classification: 'script' },
  { keywords: ['display', 'poster', 'decorat', 'comic', 'marker', 'chalk', 'stencil', 'slab'], classification: 'display' },
  { keywords: ['serif', 'roman', 'garamond', 'baskerville', 'bodoni', 'caslon', 'didot', 'times', 'georgia', 'palatino', 'book'], classification: 'serif' },
];

export function getClassification(fontFamily: string): FontClassification {
  // Direct lookup
  const direct = FONT_CLASSIFICATION_MAP[fontFamily];
  if (direct) return direct;

  // Case-insensitive lookup
  const lower = fontFamily.toLowerCase();
  for (const [key, value] of Object.entries(FONT_CLASSIFICATION_MAP)) {
    if (key.toLowerCase() === lower) return value;
  }

  // Keyword-based detection
  for (const { keywords, classification } of CLASSIFICATION_KEYWORDS) {
    if (keywords.some((kw) => lower.includes(kw))) {
      return classification;
    }
  }

  return 'sans-serif';
}

const PAIRING_REASONS: Record<string, string[]> = {
  'serif+sans-serif': [
    'Classic serif heading with clean sans-serif body',
    'Elegant serif contrast with modern sans-serif readability',
    'Traditional heading meets contemporary body text',
  ],
  'sans-serif+serif': [
    'Modern heading with classic serif body for easy reading',
    'Clean sans-serif header paired with elegant serif body',
    'Contemporary heading with timeless serif body text',
  ],
  'display+sans-serif': [
    'Bold display heading with clean sans-serif body',
    'Eye-catching display type balanced by neutral body text',
    'Statement heading paired with readable sans-serif body',
  ],
  'script+sans-serif': [
    'Elegant script heading with crisp sans-serif body',
    'Decorative script accent balanced by clean body text',
    'Artistic script heading grounded by sans-serif readability',
  ],
  'monospace+sans-serif': [
    'Technical monospace heading with approachable sans-serif body',
    'Code-style heading paired with clean sans-serif text',
    'Structured monospace accent with modern body font',
  ],
  'sans-serif+monospace': [
    'Clean heading with technical monospace body for data',
    'Modern heading paired with structured monospace body',
  ],
  'same': [
    'Same family for cohesive look with weight contrast',
    'Unified type family with style variation',
    'Harmonious pairing within the same classification',
  ],
};

function getReasonForPairing(
  sourceClass: FontClassification,
  targetClass: FontClassification,
): string {
  const key = sourceClass === targetClass ? 'same' : `${sourceClass}+${targetClass}`;
  const reasons = PAIRING_REASONS[key] || PAIRING_REASONS['same'];
  return reasons[Math.floor(Math.random() * reasons.length)];
}

// Deterministic shuffle seeded by the source font name
function seededShuffle<T>(arr: T[], seed: string): T[] {
  const result = [...arr];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  }
  for (let i = result.length - 1; i > 0; i--) {
    hash = ((hash << 5) - hash + i) | 0;
    const j = Math.abs(hash) % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function findPairings(fontFamily: string, allFonts: string[]): PairingResult[] {
  const sourceClass = getClassification(fontFamily);
  const results: PairingResult[] = [];
  const candidates = allFonts.filter((f) => f !== fontFamily);

  // Classify all candidates
  const classified = candidates.map((f) => ({
    font: f,
    classification: getClassification(f),
  }));

  // Build pairing pools based on source classification
  const pools: { filter: (c: FontClassification) => boolean; role: 'heading' | 'body'; priority: number }[] = [];

  switch (sourceClass) {
    case 'serif':
      // Serif pairs best with sans-serif body
      pools.push({ filter: (c) => c === 'sans-serif', role: 'body', priority: 1 });
      pools.push({ filter: (c) => c === 'serif' && c === sourceClass, role: 'body', priority: 3 });
      break;
    case 'sans-serif':
      // Sans-serif pairs with serif body or serif heading
      pools.push({ filter: (c) => c === 'serif', role: 'heading', priority: 1 });
      pools.push({ filter: (c) => c === 'serif', role: 'body', priority: 2 });
      pools.push({ filter: (c) => c === 'sans-serif', role: 'body', priority: 3 });
      break;
    case 'display':
    case 'script':
      // Display/script always heading, pair with clean sans-serif body
      pools.push({ filter: (c) => c === 'sans-serif', role: 'body', priority: 1 });
      pools.push({ filter: (c) => c === 'serif', role: 'body', priority: 2 });
      break;
    case 'monospace':
      // Monospace pairs with sans-serif
      pools.push({ filter: (c) => c === 'sans-serif', role: 'body', priority: 1 });
      pools.push({ filter: (c) => c === 'sans-serif', role: 'heading', priority: 2 });
      break;
  }

  // Collect pairings from pools in priority order
  for (const pool of pools.sort((a, b) => a.priority - b.priority)) {
    if (results.length >= 5) break;

    const matching = classified.filter((c) => pool.filter(c.classification));
    const shuffled = seededShuffle(matching, fontFamily);

    for (const match of shuffled) {
      if (results.length >= 5) break;
      if (results.some((r) => r.font === match.font)) continue;

      results.push({
        font: match.font,
        role: pool.role,
        reason: getReasonForPairing(sourceClass, match.classification),
      });
    }
  }

  // If we still need more, fill with any remaining fonts
  if (results.length < 5) {
    const remaining = seededShuffle(
      classified.filter((c) => !results.some((r) => r.font === c.font)),
      fontFamily,
    );
    for (const match of remaining) {
      if (results.length >= 5) break;
      results.push({
        font: match.font,
        role: 'body',
        reason: getReasonForPairing(sourceClass, match.classification),
      });
    }
  }

  return results.slice(0, 5);
}
