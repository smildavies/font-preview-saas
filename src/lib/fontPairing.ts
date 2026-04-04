export type FontClassification = 'serif' | 'sans-serif' | 'monospace' | 'script' | 'display';

export interface PairingResult {
  font: string;
  role: 'heading' | 'body';
  score: number;
  reason: string;
  moods: string[];
  useCase: string;
}

// ─── Font Classification Database ───────────────────────────────────────────

interface FontProfile {
  class: FontClassification;
  weight: 'light' | 'regular' | 'bold' | 'heavy';
  width: 'condensed' | 'normal' | 'wide';
  era: 'classical' | 'transitional' | 'modern' | 'contemporary';
  personality: string[];
}

const FONT_PROFILES: Record<string, FontProfile> = {
  // Sans-Serif
  'Arial':              { class: 'sans-serif', weight: 'regular', width: 'normal', era: 'modern', personality: ['neutral', 'clean'] },
  'Arial Black':        { class: 'sans-serif', weight: 'heavy', width: 'normal', era: 'modern', personality: ['bold', 'impactful'] },
  'Arial Narrow':       { class: 'sans-serif', weight: 'regular', width: 'condensed', era: 'modern', personality: ['compact', 'efficient'] },
  'Avenir':             { class: 'sans-serif', weight: 'regular', width: 'normal', era: 'modern', personality: ['geometric', 'elegant'] },
  'Avenir Next':        { class: 'sans-serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['refined', 'versatile'] },
  'Calibri':            { class: 'sans-serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['warm', 'friendly'] },
  'Century Gothic':     { class: 'sans-serif', weight: 'regular', width: 'normal', era: 'modern', personality: ['geometric', 'clean'] },
  'DIN':                { class: 'sans-serif', weight: 'regular', width: 'normal', era: 'modern', personality: ['industrial', 'functional'] },
  'DIN Alternate':      { class: 'sans-serif', weight: 'regular', width: 'normal', era: 'modern', personality: ['industrial', 'functional'] },
  'DIN Condensed':      { class: 'sans-serif', weight: 'regular', width: 'condensed', era: 'modern', personality: ['industrial', 'compact'] },
  'Futura':             { class: 'sans-serif', weight: 'regular', width: 'normal', era: 'modern', personality: ['geometric', 'forward'] },
  'Futura PT':          { class: 'sans-serif', weight: 'regular', width: 'normal', era: 'modern', personality: ['geometric', 'forward'] },
  'Geneva':             { class: 'sans-serif', weight: 'regular', width: 'normal', era: 'modern', personality: ['neutral', 'system'] },
  'Gill Sans':          { class: 'sans-serif', weight: 'regular', width: 'normal', era: 'transitional', personality: ['humanist', 'British'] },
  'Gotham':             { class: 'sans-serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['authoritative', 'geometric'] },
  'Helvetica':          { class: 'sans-serif', weight: 'regular', width: 'normal', era: 'modern', personality: ['neutral', 'Swiss'] },
  'Helvetica Neue':     { class: 'sans-serif', weight: 'regular', width: 'normal', era: 'modern', personality: ['neutral', 'refined'] },
  'Impact':             { class: 'sans-serif', weight: 'heavy', width: 'condensed', era: 'modern', personality: ['bold', 'impactful'] },
  'Inter':              { class: 'sans-serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['UI', 'readable'] },
  'Lucida Grande':      { class: 'sans-serif', weight: 'regular', width: 'normal', era: 'modern', personality: ['friendly', 'readable'] },
  'Optima':             { class: 'sans-serif', weight: 'regular', width: 'normal', era: 'transitional', personality: ['elegant', 'humanist'] },
  'San Francisco':      { class: 'sans-serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['system', 'clean'] },
  'Segoe UI':           { class: 'sans-serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['friendly', 'readable'] },
  'Tahoma':             { class: 'sans-serif', weight: 'regular', width: 'normal', era: 'modern', personality: ['compact', 'readable'] },
  'Trebuchet MS':       { class: 'sans-serif', weight: 'regular', width: 'normal', era: 'modern', personality: ['dynamic', 'web'] },
  'Verdana':            { class: 'sans-serif', weight: 'regular', width: 'wide', era: 'modern', personality: ['readable', 'web'] },
  'Franklin Gothic':    { class: 'sans-serif', weight: 'bold', width: 'normal', era: 'transitional', personality: ['editorial', 'strong'] },
  'Franklin Gothic Medium': { class: 'sans-serif', weight: 'bold', width: 'normal', era: 'transitional', personality: ['editorial', 'strong'] },
  'Proxima Nova':       { class: 'sans-serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['versatile', 'modern'] },
  'Brandon Grotesque':  { class: 'sans-serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['geometric', 'friendly'] },
  'Myriad Pro':         { class: 'sans-serif', weight: 'regular', width: 'normal', era: 'modern', personality: ['humanist', 'versatile'] },
  'Aptos':              { class: 'sans-serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['clean', 'modern'] },
  'Bahnschrift':        { class: 'sans-serif', weight: 'regular', width: 'normal', era: 'modern', personality: ['industrial', 'German'] },
  'Roboto':             { class: 'sans-serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['mechanical', 'friendly'] },
  'Open Sans':          { class: 'sans-serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['neutral', 'readable'] },
  'Lato':               { class: 'sans-serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['warm', 'stable'] },
  'Montserrat':         { class: 'sans-serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['urban', 'geometric'] },
  'Oswald':             { class: 'sans-serif', weight: 'regular', width: 'condensed', era: 'contemporary', personality: ['editorial', 'bold'] },
  'Raleway':            { class: 'sans-serif', weight: 'light', width: 'normal', era: 'contemporary', personality: ['elegant', 'thin'] },
  'Poppins':            { class: 'sans-serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['geometric', 'friendly'] },
  'Noto Sans':          { class: 'sans-serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['universal', 'readable'] },
  'Ubuntu':             { class: 'sans-serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['humanist', 'tech'] },
  'Nunito':             { class: 'sans-serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['rounded', 'friendly'] },
  'Nunito Sans':        { class: 'sans-serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['rounded', 'clean'] },
  'Source Sans Pro':    { class: 'sans-serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['readable', 'professional'] },
  'Fira Sans':          { class: 'sans-serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['humanist', 'tech'] },
  'Work Sans':          { class: 'sans-serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['grotesque', 'functional'] },
  'Quicksand':          { class: 'sans-serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['rounded', 'playful'] },
  'Barlow':             { class: 'sans-serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['grotesque', 'industrial'] },
  'Rubik':              { class: 'sans-serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['rounded', 'modern'] },
  'Karla':              { class: 'sans-serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['grotesque', 'character'] },
  'Josefin Sans':       { class: 'sans-serif', weight: 'light', width: 'normal', era: 'contemporary', personality: ['geometric', 'vintage'] },
  'Cabin':              { class: 'sans-serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['humanist', 'moderate'] },
  'Exo 2':              { class: 'sans-serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['geometric', 'tech'] },
  'Archivo':            { class: 'sans-serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['grotesque', 'versatile'] },
  'Archivo Narrow':     { class: 'sans-serif', weight: 'regular', width: 'condensed', era: 'contemporary', personality: ['editorial', 'compact'] },
  'Dosis':              { class: 'sans-serif', weight: 'light', width: 'normal', era: 'contemporary', personality: ['rounded', 'modern'] },
  'Heebo':              { class: 'sans-serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['clean', 'neutral'] },
  'Hind':               { class: 'sans-serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['readable', 'global'] },
  'IBM Plex Sans':      { class: 'sans-serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['corporate', 'tech'] },
  'Kanit':              { class: 'sans-serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['geometric', 'Thai-inspired'] },
  'Libre Franklin':     { class: 'sans-serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['classic', 'reinterpretation'] },
  'Maven Pro':          { class: 'sans-serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['geometric', 'unique'] },
  'Overpass':           { class: 'sans-serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['web', 'open'] },
  'Oxygen':             { class: 'sans-serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['clean', 'readable'] },
  'Teko':               { class: 'sans-serif', weight: 'regular', width: 'condensed', era: 'contemporary', personality: ['narrow', 'display'] },
  'Titillium Web':      { class: 'sans-serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['geometric', 'academic'] },
  'Varela Round':       { class: 'sans-serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['rounded', 'soft'] },
  'PT Sans':            { class: 'sans-serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['humanist', 'universal'] },
  'Catamaran':          { class: 'sans-serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['Tamil-inspired', 'modern'] },
  'Asap':               { class: 'sans-serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['rounded', 'contemporary'] },
  'Encode Sans':        { class: 'sans-serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['versatile', 'multi-width'] },
  'Mukta':              { class: 'sans-serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['readable', 'global'] },
  'Nanum Gothic':       { class: 'sans-serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['Korean', 'clean'] },
  'Play':               { class: 'sans-serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['tech', 'minimal'] },
  'Prompt':             { class: 'sans-serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['looped', 'Thai-inspired'] },
  'Questrial':          { class: 'sans-serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['geometric', 'readable'] },
  'Rajdhani':           { class: 'sans-serif', weight: 'regular', width: 'condensed', era: 'contemporary', personality: ['open', 'tech'] },
  'Sarabun':            { class: 'sans-serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['clean', 'Thai'] },
  'Signika':            { class: 'sans-serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['wayfinding', 'readable'] },

  // Serif
  'American Typewriter': { class: 'serif', weight: 'regular', width: 'normal', era: 'transitional', personality: ['typewriter', 'vintage'] },
  'Baskerville':        { class: 'serif', weight: 'regular', width: 'normal', era: 'transitional', personality: ['elegant', 'British'] },
  'Big Caslon':         { class: 'serif', weight: 'regular', width: 'normal', era: 'classical', personality: ['editorial', 'distinguished'] },
  'Bodoni 72':          { class: 'serif', weight: 'regular', width: 'normal', era: 'modern', personality: ['high-contrast', 'fashion'] },
  'Bodoni 72 Oldstyle': { class: 'serif', weight: 'regular', width: 'normal', era: 'modern', personality: ['fashion', 'luxurious'] },
  'Book Antiqua':       { class: 'serif', weight: 'regular', width: 'normal', era: 'classical', personality: ['book', 'traditional'] },
  'Bookman Old Style':  { class: 'serif', weight: 'bold', width: 'wide', era: 'transitional', personality: ['sturdy', 'readable'] },
  'Cambria':            { class: 'serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['screen', 'readable'] },
  'Century':            { class: 'serif', weight: 'regular', width: 'normal', era: 'transitional', personality: ['editorial', 'classic'] },
  'Century Schoolbook': { class: 'serif', weight: 'regular', width: 'normal', era: 'transitional', personality: ['textbook', 'readable'] },
  'Charter':            { class: 'serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['screen', 'readable'] },
  'Cochin':             { class: 'serif', weight: 'regular', width: 'normal', era: 'classical', personality: ['French', 'delicate'] },
  'Constantia':         { class: 'serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['screen', 'readable'] },
  'Didot':              { class: 'serif', weight: 'regular', width: 'normal', era: 'modern', personality: ['high-contrast', 'fashion'] },
  'Georgia':            { class: 'serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['web', 'readable'] },
  'Hoefler Text':       { class: 'serif', weight: 'regular', width: 'normal', era: 'classical', personality: ['refined', 'book'] },
  'Palatino':           { class: 'serif', weight: 'regular', width: 'normal', era: 'classical', personality: ['humanist', 'warm'] },
  'Palatino Linotype':  { class: 'serif', weight: 'regular', width: 'normal', era: 'classical', personality: ['humanist', 'warm'] },
  'Rockwell':           { class: 'serif', weight: 'bold', width: 'normal', era: 'modern', personality: ['slab', 'industrial'] },
  'Times':              { class: 'serif', weight: 'regular', width: 'condensed', era: 'transitional', personality: ['newspaper', 'efficient'] },
  'Times New Roman':    { class: 'serif', weight: 'regular', width: 'condensed', era: 'transitional', personality: ['newspaper', 'formal'] },
  'Garamond':           { class: 'serif', weight: 'light', width: 'normal', era: 'classical', personality: ['elegant', 'literary'] },
  'Adobe Garamond Pro': { class: 'serif', weight: 'light', width: 'normal', era: 'classical', personality: ['elegant', 'literary'] },
  'Minion Pro':         { class: 'serif', weight: 'regular', width: 'normal', era: 'classical', personality: ['book', 'refined'] },
  'Playfair Display':   { class: 'serif', weight: 'bold', width: 'normal', era: 'modern', personality: ['high-contrast', 'editorial'] },
  'Merriweather':       { class: 'serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['screen', 'readable'] },
  'PT Serif':           { class: 'serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['universal', 'readable'] },
  'Source Serif Pro':   { class: 'serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['readable', 'professional'] },
  'Libre Baskerville':  { class: 'serif', weight: 'regular', width: 'normal', era: 'transitional', personality: ['web', 'classic'] },
  'Crimson Text':       { class: 'serif', weight: 'regular', width: 'normal', era: 'classical', personality: ['book', 'elegant'] },
  'Cormorant Garamond': { class: 'serif', weight: 'light', width: 'normal', era: 'classical', personality: ['display', 'elegant'] },
  'EB Garamond':        { class: 'serif', weight: 'regular', width: 'normal', era: 'classical', personality: ['literary', 'refined'] },
  'Bitter':             { class: 'serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['slab', 'screen'] },
  'Arvo':               { class: 'serif', weight: 'bold', width: 'normal', era: 'contemporary', personality: ['slab', 'geometric'] },
  'Josefin Slab':       { class: 'serif', weight: 'light', width: 'normal', era: 'contemporary', personality: ['geometric', 'vintage'] },
  'Cardo':              { class: 'serif', weight: 'regular', width: 'normal', era: 'classical', personality: ['scholarly', 'Unicode'] },
  'Cinzel':             { class: 'serif', weight: 'regular', width: 'normal', era: 'classical', personality: ['inscriptional', 'monumental'] },
  'IBM Plex Serif':     { class: 'serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['corporate', 'tech'] },
  'Noto Serif':         { class: 'serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['universal', 'readable'] },
  'Philosopher':        { class: 'serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['intellectual', 'Russian'] },
  'Rokkitt':            { class: 'serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['slab', 'friendly'] },
  'Spectral':           { class: 'serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['screen', 'readable'] },
  'Zilla Slab':         { class: 'serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['slab', 'tech'] },
  'Abril Fatface':      { class: 'display', weight: 'heavy', width: 'normal', era: 'modern', personality: ['high-contrast', 'editorial'] },
  'Alfa Slab One':      { class: 'display', weight: 'heavy', width: 'normal', era: 'contemporary', personality: ['slab', 'impactful'] },

  // Monospace
  'Andale Mono':        { class: 'monospace', weight: 'regular', width: 'normal', era: 'modern', personality: ['technical', 'clean'] },
  'Consolas':           { class: 'monospace', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['code', 'readable'] },
  'Courier':            { class: 'monospace', weight: 'regular', width: 'wide', era: 'classical', personality: ['typewriter', 'vintage'] },
  'Courier New':        { class: 'monospace', weight: 'regular', width: 'wide', era: 'classical', personality: ['typewriter', 'formal'] },
  'Lucida Console':     { class: 'monospace', weight: 'regular', width: 'normal', era: 'modern', personality: ['technical', 'readable'] },
  'Menlo':              { class: 'monospace', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['code', 'Apple'] },
  'Monaco':             { class: 'monospace', weight: 'regular', width: 'normal', era: 'modern', personality: ['code', 'compact'] },
  'Source Code Pro':    { class: 'monospace', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['code', 'readable'] },
  'Fira Code':          { class: 'monospace', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['code', 'ligatures'] },
  'Inconsolata':        { class: 'monospace', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['code', 'humanist'] },
  'IBM Plex Mono':      { class: 'monospace', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['corporate', 'tech'] },
  'Cascadia Code':      { class: 'monospace', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['code', 'ligatures'] },

  // Script / Handwriting
  'Bradley Hand':       { class: 'script', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['casual', 'handwritten'] },
  'Brush Script MT':    { class: 'script', weight: 'regular', width: 'normal', era: 'modern', personality: ['brush', 'retro'] },
  'Luminari':           { class: 'script', weight: 'regular', width: 'normal', era: 'classical', personality: ['calligraphic', 'ornate'] },
  'Savoye LET':         { class: 'script', weight: 'light', width: 'normal', era: 'classical', personality: ['formal', 'calligraphic'] },
  'SignPainter':        { class: 'script', weight: 'regular', width: 'normal', era: 'modern', personality: ['sign', 'retro'] },
  'Snell Roundhand':    { class: 'script', weight: 'light', width: 'normal', era: 'classical', personality: ['formal', 'copperplate'] },
  'Zapfino':            { class: 'script', weight: 'regular', width: 'wide', era: 'classical', personality: ['calligraphic', 'luxurious'] },
  'Segoe Script':       { class: 'script', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['casual', 'friendly'] },
  'Dancing Script':     { class: 'script', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['lively', 'casual'] },
  'Great Vibes':        { class: 'script', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['formal', 'wedding'] },
  'Indie Flower':       { class: 'script', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['casual', 'handwritten'] },
  'Lobster':            { class: 'script', weight: 'bold', width: 'normal', era: 'contemporary', personality: ['retro', 'bold'] },
  'Lobster Two':        { class: 'script', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['retro', 'lighter'] },
  'Pacifico':           { class: 'script', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['surf', 'fun'] },
  'Sacramento':         { class: 'script', weight: 'light', width: 'normal', era: 'contemporary', personality: ['flowing', 'elegant'] },
  'Satisfy':            { class: 'script', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['casual', 'retro'] },
  'Shadows Into Light': { class: 'script', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['handwritten', 'light'] },
  'Tangerine':          { class: 'script', weight: 'light', width: 'normal', era: 'contemporary', personality: ['calligraphic', 'delicate'] },
  'Comfortaa':          { class: 'script', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['rounded', 'geometric'] },
  'Merienda':           { class: 'script', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['semi-connected', 'warm'] },

  // Display / Decorative
  'Chalkboard':         { class: 'display', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['chalk', 'casual'] },
  'Chalkboard SE':      { class: 'display', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['chalk', 'casual'] },
  'Chalkduster':        { class: 'display', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['chalk', 'playful'] },
  'Copperplate':        { class: 'display', weight: 'bold', width: 'normal', era: 'classical', personality: ['engraved', 'formal'] },
  'Marker Felt':        { class: 'display', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['marker', 'casual'] },
  'Papyrus':            { class: 'display', weight: 'regular', width: 'normal', era: 'classical', personality: ['ancient', 'rustic'] },
  'Comic Sans MS':      { class: 'display', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['comic', 'casual'] },
  'Comic Sans':         { class: 'display', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['comic', 'casual'] },
  'Permanent Marker':   { class: 'display', weight: 'bold', width: 'normal', era: 'contemporary', personality: ['marker', 'bold'] },
  'Anton':              { class: 'display', weight: 'heavy', width: 'condensed', era: 'contemporary', personality: ['impact', 'advertising'] },
  'Archivo Black':      { class: 'display', weight: 'heavy', width: 'normal', era: 'contemporary', personality: ['grotesque', 'impactful'] },
  'Bebas Neue':         { class: 'display', weight: 'regular', width: 'condensed', era: 'contemporary', personality: ['narrow', 'display'] },
  'Fjalla One':         { class: 'display', weight: 'bold', width: 'condensed', era: 'contemporary', personality: ['condensed', 'strong'] },
  'Righteous':          { class: 'display', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['retro', 'funky'] },
  'Titan One':          { class: 'display', weight: 'heavy', width: 'normal', era: 'contemporary', personality: ['rounded', 'playful'] },
  'Yanone Kaffeesatz':  { class: 'display', weight: 'regular', width: 'condensed', era: 'contemporary', personality: ['coffee', 'German'] },
  'Stencil':            { class: 'display', weight: 'bold', width: 'normal', era: 'modern', personality: ['military', 'stencil'] },
};

// Keyword-based classification rules with personality inference
const KEYWORD_RULES: { keywords: string[]; profile: Partial<FontProfile> }[] = [
  // Monospace
  { keywords: ['mono', 'code', 'console', 'terminal', 'courier'], profile: { class: 'monospace', personality: ['technical', 'code'] } },
  // Script / Handwriting
  { keywords: ['script', 'cursive', 'calligraph'], profile: { class: 'script', personality: ['calligraphic', 'elegant'] } },
  { keywords: ['hand', 'writing', 'handlee', 'finger'], profile: { class: 'script', personality: ['handwritten', 'casual'] } },
  { keywords: ['brush', 'paint', 'ink'], profile: { class: 'script', personality: ['brush', 'artistic'] } },
  { keywords: ['dance', 'dancing', 'lobster', 'pacifico', 'satisfy', 'sacramento'], profile: { class: 'script', personality: ['flowing', 'fun'] } },
  // Display / Decorative
  { keywords: ['display', 'poster', 'banner', 'headline'], profile: { class: 'display', personality: ['display', 'impactful'] } },
  { keywords: ['decorat', 'ornament', 'fancy'], profile: { class: 'display', personality: ['decorative', 'ornate'] } },
  { keywords: ['comic', 'cartoon', 'fun', 'playful'], profile: { class: 'display', personality: ['comic', 'playful'] } },
  { keywords: ['marker', 'chalk', 'crayon', 'sketch'], profile: { class: 'display', personality: ['marker', 'casual'] } },
  { keywords: ['stencil', 'military', 'army'], profile: { class: 'display', personality: ['stencil', 'industrial'] } },
  { keywords: ['slab'], profile: { class: 'display', personality: ['slab', 'sturdy'] } },
  { keywords: ['retro', 'vintage', 'classic', 'old'], profile: { class: 'display', era: 'transitional', personality: ['vintage', 'nostalgic'] } },
  // Serif
  { keywords: ['serif', 'roman'], profile: { class: 'serif', personality: ['traditional', 'readable'] } },
  { keywords: ['garamond', 'caslon', 'jenson'], profile: { class: 'serif', era: 'classical', personality: ['elegant', 'literary'] } },
  { keywords: ['baskerville', 'didot', 'bodoni'], profile: { class: 'serif', era: 'modern', personality: ['high-contrast', 'refined'] } },
  { keywords: ['times', 'georgia', 'palatino'], profile: { class: 'serif', era: 'transitional', personality: ['readable', 'classic'] } },
  { keywords: ['book', 'text', 'reading'], profile: { class: 'serif', personality: ['book', 'readable'] } },
  // Weight keywords
  { keywords: ['black', 'heavy', 'ultra', 'extra bold', 'fat'], profile: { weight: 'heavy', personality: ['impactful'] } },
  { keywords: ['bold', 'strong'], profile: { weight: 'bold', personality: ['strong'] } },
  { keywords: ['light', 'thin', 'hairline'], profile: { weight: 'light', personality: ['delicate'] } },
  // Width keywords
  { keywords: ['condensed', 'narrow', 'compressed'], profile: { width: 'condensed', personality: ['compact'] } },
  { keywords: ['wide', 'extended', 'expanded'], profile: { width: 'wide', personality: ['expansive'] } },
  // Personality keywords
  { keywords: ['round', 'soft'], profile: { personality: ['rounded', 'friendly'] } },
  { keywords: ['grotesque', 'grotesk', 'gothic'], profile: { class: 'sans-serif', personality: ['grotesque', 'editorial'] } },
  { keywords: ['geometric', 'geo'], profile: { class: 'sans-serif', personality: ['geometric', 'modern'] } },
  { keywords: ['humanist'], profile: { class: 'sans-serif', personality: ['humanist', 'warm'] } },
  { keywords: ['pro', 'std', 'lt'], profile: { personality: ['professional'] } },
  { keywords: ['italian', 'french', 'spanish'], profile: { personality: ['European', 'elegant'] } },
  { keywords: ['wedding', 'love', 'heart', 'bridal'], profile: { class: 'script', personality: ['romantic', 'wedding'] } },
  { keywords: ['tech', 'digital', 'cyber', 'pixel'], profile: { personality: ['tech', 'modern'] } },
  { keywords: ['elegant', 'luxury', 'premium', 'royal'], profile: { personality: ['elegant', 'luxurious'] } },
];

function getProfile(fontFamily: string): FontProfile {
  const direct = FONT_PROFILES[fontFamily];
  if (direct) return direct;

  // Case-insensitive lookup
  const lower = fontFamily.toLowerCase();
  for (const [key, value] of Object.entries(FONT_PROFILES)) {
    if (key.toLowerCase() === lower) return value;
  }

  // Build a profile from keyword analysis — accumulate traits from all matching rules
  const profile: FontProfile = {
    class: 'sans-serif',
    weight: 'regular',
    width: 'normal',
    era: 'contemporary',
    personality: [],
  };

  let classSet = false;
  for (const rule of KEYWORD_RULES) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      if (rule.profile.class && !classSet) {
        profile.class = rule.profile.class;
        classSet = true;
      }
      if (rule.profile.weight) profile.weight = rule.profile.weight;
      if (rule.profile.width) profile.width = rule.profile.width;
      if (rule.profile.era) profile.era = rule.profile.era;
      if (rule.profile.personality) {
        for (const p of rule.profile.personality) {
          if (!profile.personality.includes(p)) profile.personality.push(p);
        }
      }
    }
  }

  // If no personality was inferred, add generic traits based on class
  if (profile.personality.length === 0) {
    const defaults: Record<FontClassification, string[]> = {
      'sans-serif': ['clean', 'modern'],
      'serif': ['traditional', 'readable'],
      'monospace': ['technical', 'structured'],
      'script': ['artistic', 'expressive'],
      'display': ['eye-catching', 'bold'],
    };
    profile.personality = defaults[profile.class];
  }

  return profile;
}

export function getClassification(fontFamily: string): FontClassification {
  return getProfile(fontFamily).class;
}

// ─── Harmony Scoring Engine ─────────────────────────────────────────────────

function calculateHarmonyScore(source: FontProfile, target: FontProfile): number {
  let score = 50; // base score

  // Class contrast bonus (the #1 rule of typography)
  const classContrast: Record<string, Record<string, number>> = {
    'serif':      { 'sans-serif': 25, 'monospace': 10, 'script': 5, 'display': 8, 'serif': -5 },
    'sans-serif': { 'serif': 25, 'monospace': 12, 'script': 15, 'display': 10, 'sans-serif': -5 },
    'display':    { 'sans-serif': 22, 'serif': 18, 'monospace': 8, 'script': -10, 'display': -15 },
    'script':     { 'sans-serif': 22, 'serif': 15, 'monospace': 10, 'display': -5, 'script': -20 },
    'monospace':  { 'sans-serif': 20, 'serif': 15, 'script': 5, 'display': 8, 'monospace': -10 },
  };
  score += classContrast[source.class]?.[target.class] ?? 0;

  // Weight contrast (light heading + regular body = good; same weight = okay)
  if (source.weight !== target.weight) score += 8;
  if ((source.weight === 'heavy' || source.weight === 'bold') && target.weight === 'regular') score += 5;

  // Era harmony (same era or adjacent = good)
  const eras = ['classical', 'transitional', 'modern', 'contemporary'];
  const eraGap = Math.abs(eras.indexOf(source.era) - eras.indexOf(target.era));
  if (eraGap <= 1) score += 8;
  else if (eraGap >= 3) score -= 5;

  // Width contrast adds visual interest
  if (source.width !== target.width) score += 5;

  // Personality overlap (shared traits = cohesion)
  const shared = source.personality.filter(p => target.personality.includes(p));
  score += shared.length * 4;

  // Complementary personality bonus
  const complements: [string, string][] = [
    ['geometric', 'humanist'], ['elegant', 'readable'], ['editorial', 'readable'],
    ['modern', 'classical'], ['bold', 'delicate'], ['industrial', 'elegant'],
    ['tech', 'humanist'], ['formal', 'casual'], ['warm', 'clean'],
  ];
  for (const [a, b] of complements) {
    if ((source.personality.includes(a) && target.personality.includes(b)) ||
        (source.personality.includes(b) && target.personality.includes(a))) {
      score += 6;
    }
  }

  return Math.max(30, Math.min(98, score));
}

// ─── Mood & Use Case Generation ─────────────────────────────────────────────

const MOOD_MAP: Record<string, string[]> = {
  'serif+sans-serif':     ['editorial', 'professional', 'trustworthy'],
  'sans-serif+serif':     ['modern-classic', 'balanced', 'sophisticated'],
  'script+sans-serif':    ['elegant', 'creative', 'personal'],
  'display+sans-serif':   ['bold', 'eye-catching', 'energetic'],
  'monospace+sans-serif': ['tech-forward', 'developer', 'modern'],
  'sans-serif+monospace': ['technical', 'structured', 'minimal'],
  'serif+serif':          ['literary', 'traditional', 'scholarly'],
  'sans-serif+sans-serif':['clean', 'minimal', 'contemporary'],
  'display+serif':        ['dramatic', 'luxury', 'statement'],
  'script+serif':         ['romantic', 'classical', 'refined'],
};

const PERSONALITY_MOODS: Record<string, string[]> = {
  'fashion':       ['luxury', 'editorial', 'high-end'],
  'high-contrast': ['dramatic', 'fashion', 'editorial'],
  'geometric':     ['modern', 'clean', 'tech'],
  'humanist':      ['warm', 'approachable', 'readable'],
  'rounded':       ['friendly', 'playful', 'approachable'],
  'industrial':    ['rugged', 'masculine', 'urban'],
  'calligraphic':  ['elegant', 'artistic', 'ceremonial'],
  'handwritten':   ['personal', 'creative', 'authentic'],
  'vintage':       ['retro', 'nostalgic', 'charming'],
  'tech':          ['innovative', 'cutting-edge', 'digital'],
  'editorial':     ['professional', 'magazine', 'polished'],
  'book':          ['literary', 'intellectual', 'timeless'],
};

function getMoods(source: FontProfile, target: FontProfile): string[] {
  const key = `${source.class}+${target.class}`;
  const baseMoods = MOOD_MAP[key] || ['versatile', 'balanced'];

  // Add personality-driven moods
  const extraMoods = new Set<string>();
  for (const p of [...source.personality, ...target.personality]) {
    const pm = PERSONALITY_MOODS[p];
    if (pm) pm.forEach(m => extraMoods.add(m));
  }

  // Combine, dedupe, pick top 3
  const all = [...baseMoods, ...extraMoods];
  const unique = [...new Set(all)];
  return unique.slice(0, 3);
}

const USE_CASE_MAP: Record<string, string[]> = {
  'serif+sans-serif':     ['Magazine editorial layout', 'Corporate annual report', 'Book cover design', 'News website', 'Law firm branding'],
  'sans-serif+serif':     ['SaaS landing page', 'Product documentation', 'Tech blog', 'Portfolio site', 'App onboarding'],
  'script+sans-serif':    ['Wedding invitations', 'Beauty brand packaging', 'Boutique signage', 'Restaurant menu', 'Greeting cards'],
  'display+sans-serif':   ['Concert poster', 'Sports branding', 'Event flyer', 'Streetwear brand', 'YouTube thumbnail'],
  'monospace+sans-serif': ['Developer portfolio', 'Tech startup site', 'Code documentation', 'Crypto landing page', 'Terminal UI'],
  'sans-serif+monospace': ['Data dashboard', 'Analytics report', 'Technical spec sheet', 'API documentation', 'Dev tools interface'],
  'serif+serif':          ['Academic journal', 'Literary magazine', 'Classic book interior', 'Museum catalog', 'Fine dining menu'],
  'sans-serif+sans-serif':['Mobile app UI', 'SaaS dashboard', 'Social media graphics', 'Presentation deck', 'E-commerce site'],
  'display+serif':        ['Luxury brand identity', 'Fashion lookbook', 'Album cover art', 'Theater poster', 'Wine label'],
  'script+serif':         ['Wedding suite', 'Perfume packaging', 'High-end event invite', 'Jewelry branding', 'Romantic novel cover'],
};

function getUseCase(source: FontProfile, target: FontProfile, seed: number): string {
  const key = `${source.class}+${target.class}`;
  const cases = USE_CASE_MAP[key] || ['General purpose design', 'Brand identity', 'Marketing materials'];
  return cases[seed % cases.length];
}

// ─── Reason Generation ──────────────────────────────────────────────────────

function generateReason(source: FontProfile, target: FontProfile, sourceName: string, targetName: string): string {
  const reasons: string[] = [];

  // Class-based insight
  if (source.class !== target.class) {
    const classReasons: Record<string, string> = {
      'serif+sans-serif':     `The high-contrast strokes of ${sourceName} create visual tension against the uniform stroke weight of ${targetName}`,
      'sans-serif+serif':     `${sourceName}'s even proportions let ${targetName}'s serif details shine as an elegant counterpoint`,
      'script+sans-serif':    `${sourceName}'s fluid letterforms are grounded by ${targetName}'s geometric stability`,
      'display+sans-serif':   `${sourceName}'s dramatic presence commands attention while ${targetName} provides clean readability`,
      'monospace+sans-serif': `${sourceName}'s fixed-width rhythm creates a structured heading that ${targetName}'s proportional spacing relaxes into`,
      'serif+monospace':      `${sourceName}'s organic curves contrast beautifully with ${targetName}'s mechanical precision`,
      'display+serif':        `${sourceName} grabs attention at display size while ${targetName}'s refined details carry the body text`,
      'script+serif':         `${sourceName}'s flowing calligraphy is balanced by ${targetName}'s structured elegance`,
    };
    const key = `${source.class}+${target.class}`;
    if (classReasons[key]) reasons.push(classReasons[key]);
  }

  // Weight insight
  if (source.weight !== target.weight) {
    reasons.push(`the weight contrast between ${source.weight} and ${target.weight} creates clear visual hierarchy`);
  }

  // Era insight
  if (source.era !== target.era && reasons.length < 2) {
    reasons.push(`blending ${source.era} and ${target.era} typographic traditions adds depth`);
  }

  // Personality insight
  const shared = source.personality.filter(p => target.personality.includes(p));
  if (shared.length > 0 && reasons.length < 2) {
    reasons.push(`both share a ${shared[0]} quality that creates visual cohesion`);
  }

  if (reasons.length === 0) {
    reasons.push(`${sourceName} and ${targetName} share compatible proportions and x-height ratios for harmonious pairing`);
  }

  // Capitalize first letter and join
  const combined = reasons.slice(0, 2).join(' — ');
  return combined.charAt(0).toUpperCase() + combined.slice(1);
}

// ─── Deterministic Seeded Shuffle ───────────────────────────────────────────

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

// ─── Curated Pairing Database ──────────────────────────────────────────────
// Industry-standard pairings sourced from Google Fonts analytics, Fontpair,
// Typewolf, and professional design usage. Each entry is [heading, body].

const CURATED_PAIRINGS: [string, string][] = [
  // Serif heading + Sans body (classic editorial)
  ['Playfair Display', 'Source Sans Pro'],
  ['Playfair Display', 'Lato'],
  ['Playfair Display', 'Raleway'],
  ['Playfair Display', 'Open Sans'],
  ['Playfair Display', 'Roboto'],
  ['Playfair Display', 'Nunito Sans'],
  ['Lora', 'Roboto'],
  ['Lora', 'Open Sans'],
  ['Lora', 'Source Sans Pro'],
  ['Merriweather', 'Open Sans'],
  ['Merriweather', 'Lato'],
  ['Merriweather', 'Roboto'],
  ['Libre Baskerville', 'Raleway'],
  ['Libre Baskerville', 'Open Sans'],
  ['Libre Baskerville', 'Montserrat'],
  ['Crimson Text', 'Raleway'],
  ['Crimson Text', 'Work Sans'],
  ['Cormorant Garamond', 'Proza Libre'],
  ['Cormorant Garamond', 'Fira Sans'],
  ['Cardo', 'Josefin Sans'],

  // Sans heading + Serif body (modern classic)
  ['Montserrat', 'Merriweather'],
  ['Montserrat', 'Lora'],
  ['Montserrat', 'Cardo'],
  ['Montserrat', 'Source Serif Pro'],
  ['Raleway', 'Lora'],
  ['Raleway', 'Merriweather'],
  ['Poppins', 'Lora'],
  ['Poppins', 'Merriweather'],
  ['Nunito', 'Lora'],
  ['Work Sans', 'Bitter'],
  ['Rubik', 'Lora'],
  ['Inter', 'Merriweather'],
  ['Inter', 'Source Serif Pro'],

  // Display heading + Sans body (bold/impactful)
  ['Oswald', 'Open Sans'],
  ['Oswald', 'Lato'],
  ['Oswald', 'Roboto'],
  ['Oswald', 'Source Sans Pro'],
  ['Abril Fatface', 'Lato'],
  ['Abril Fatface', 'Poppins'],
  ['Abril Fatface', 'Roboto'],
  ['Bebas Neue', 'Roboto'],
  ['Bebas Neue', 'Open Sans'],
  ['Bebas Neue', 'Lato'],
  ['Fjalla One', 'Open Sans'],
  ['Fjalla One', 'Roboto'],
  ['Anton', 'Roboto'],
  ['Righteous', 'Raleway'],
  ['Passion One', 'Open Sans'],

  // Sans heading + Sans body (clean/modern)
  ['Montserrat', 'Open Sans'],
  ['Raleway', 'Lato'],
  ['Poppins', 'Open Sans'],
  ['Poppins', 'Roboto'],
  ['Nunito', 'Roboto'],
  ['Josefin Sans', 'Lato'],
  ['Archivo Black', 'Roboto'],
  ['Archivo', 'Roboto'],

  // Script heading + Sans body (elegant/creative)
  ['Dancing Script', 'Open Sans'],
  ['Dancing Script', 'Lato'],
  ['Pacifico', 'Roboto'],
  ['Great Vibes', 'Raleway'],
  ['Sacramento', 'Montserrat'],
  ['Satisfy', 'Open Sans'],
  ['Allura', 'Lato'],

  // Superfamily & designer-intended pairs
  ['Roboto', 'Roboto Slab'],
  ['Roboto Slab', 'Roboto'],
  ['PT Sans', 'PT Serif'],
  ['PT Serif', 'PT Sans'],
  ['Noto Sans', 'Noto Serif'],
  ['Noto Serif', 'Noto Sans'],
  ['Source Sans Pro', 'Source Serif Pro'],
  ['Source Serif Pro', 'Source Sans Pro'],
  ['IBM Plex Sans', 'IBM Plex Serif'],
  ['IBM Plex Serif', 'IBM Plex Sans'],
  ['Fira Sans', 'Fira Mono'],

  // System/Desktop font pairings
  ['Futura', 'Garamond'],
  ['Futura', 'Georgia'],
  ['Futura', 'Bodoni'],
  ['Futura', 'Palatino'],
  ['Futura', 'Times New Roman'],
  ['Helvetica', 'Garamond'],
  ['Helvetica', 'Georgia'],
  ['Helvetica', 'Palatino'],
  ['Helvetica Neue', 'Garamond'],
  ['Helvetica Neue', 'Georgia'],
  ['Gill Sans', 'Caslon'],
  ['Gill Sans', 'Garamond'],
  ['Avenir', 'Georgia'],
  ['Avenir', 'Palatino'],
  ['Avenir Next', 'Georgia'],
  ['Arial', 'Georgia'],
  ['Arial', 'Times New Roman'],
  ['Verdana', 'Georgia'],
  ['Georgia', 'Verdana'],
  ['Georgia', 'Arial'],
  ['Georgia', 'Futura'],
  ['Baskerville', 'Futura'],
  ['Baskerville', 'Helvetica'],
  ['Bodoni', 'Futura'],
  ['Bodoni', 'Gill Sans'],
  ['Garamond', 'Futura'],
  ['Garamond', 'Helvetica'],
  ['Palatino', 'Helvetica'],
  ['Palatino', 'Futura'],
  ['Times New Roman', 'Arial'],
  ['Times New Roman', 'Futura'],
  ['Times New Roman', 'Helvetica'],
  ['Optima', 'Palatino'],
  ['Century Gothic', 'Georgia'],
  ['Trebuchet MS', 'Georgia'],
  ['Didot', 'Futura'],
  ['Didot', 'Gill Sans'],
  ['Rockwell', 'Helvetica'],
  ['Rockwell', 'Gill Sans'],
  ['Impact', 'Arial'],
  ['Impact', 'Helvetica'],
  ['Copperplate', 'Futura'],
  ['Copperplate', 'Avenir'],
  ['Franklin Gothic', 'Garamond'],
  ['Franklin Gothic', 'Baskerville'],
];

// Build a fast lookup: font name (lowercased) -> array of { partner, role }
type CuratedEntry = { partner: string; headingFont: string; bodyFont: string };
const CURATED_INDEX = new Map<string, CuratedEntry[]>();
for (const [h, b] of CURATED_PAIRINGS) {
  const hLow = h.toLowerCase();
  const bLow = b.toLowerCase();
  if (!CURATED_INDEX.has(hLow)) CURATED_INDEX.set(hLow, []);
  if (!CURATED_INDEX.has(bLow)) CURATED_INDEX.set(bLow, []);
  CURATED_INDEX.get(hLow)!.push({ partner: b, headingFont: h, bodyFont: b });
  CURATED_INDEX.get(bLow)!.push({ partner: h, headingFont: h, bodyFont: b });
}

// ─── Main Pairing Function ──────────────────────────────────────────────────

export function findPairings(fontFamily: string, allFonts: string[], sourceRole?: 'heading' | 'body'): PairingResult[] {
  const sourceProfile = getProfile(fontFamily);
  const allFontsLower = new Map(allFonts.map(f => [f.toLowerCase(), f]));
  const candidates = allFonts.filter((f) => f !== fontFamily);

  // --- Phase 1: Curated pairings (highest confidence) ---
  const curatedResults: PairingResult[] = [];
  const curatedEntries = CURATED_INDEX.get(fontFamily.toLowerCase()) || [];
  for (const entry of curatedEntries) {
    // Find the partner in the user's available fonts (case-insensitive)
    const partnerActual = allFontsLower.get(entry.partner.toLowerCase());
    if (!partnerActual || partnerActual === fontFamily) continue;

    const targetProfile = getProfile(partnerActual);
    const baseScore = calculateHarmonyScore(sourceProfile, targetProfile);
    // Curated pairings get a significant boost (these are proven combinations)
    const score = Math.min(98, baseScore + 15);
    const moods = getMoods(sourceProfile, targetProfile);

    // Determine roles: curated data knows the intended heading/body
    let role: 'heading' | 'body';
    if (sourceRole) {
      role = sourceRole === 'heading' ? 'body' : 'heading';
    } else {
      // Use the curated role assignment
      const sourceIsHeading = entry.headingFont.toLowerCase() === fontFamily.toLowerCase();
      role = sourceIsHeading ? 'body' : 'heading';
    }

    const reason = generateReason(sourceProfile, targetProfile, fontFamily, partnerActual)
      + ' — a professionally curated pairing used across top design projects.';
    const useCase = getUseCase(sourceProfile, targetProfile, curatedResults.length);

    curatedResults.push({ font: partnerActual, role, score, reason, moods, useCase });
  }

  // Sort curated by score
  curatedResults.sort((a, b) => b.score - a.score);

  // --- Phase 2: Algorithmic pairings (fill remaining slots) ---
  const curatedFonts = new Set(curatedResults.map(r => r.font));
  const algorithmicCandidates = candidates.filter(f => !curatedFonts.has(f));

  const scored = algorithmicCandidates.map((font, i) => {
    const targetProfile = getProfile(font);
    const score = calculateHarmonyScore(sourceProfile, targetProfile);
    const moods = getMoods(sourceProfile, targetProfile);
    const useCase = getUseCase(sourceProfile, targetProfile, i);
    const reason = generateReason(sourceProfile, targetProfile, fontFamily, font);

    let role: 'heading' | 'body';
    if (sourceRole) {
      role = sourceRole === 'heading' ? 'body' : 'heading';
    } else {
      role = 'body';
      if (['display', 'script'].includes(targetProfile.class)) {
        role = 'heading';
      } else if (targetProfile.class === 'serif' && sourceProfile.class === 'sans-serif') {
        role = 'body';
      } else if (targetProfile.class === 'sans-serif' && ['serif', 'display', 'script'].includes(sourceProfile.class)) {
        role = 'body';
      } else if (targetProfile.weight === 'heavy' || targetProfile.weight === 'bold') {
        role = 'heading';
      }
    }

    return { font, role, score, reason, moods, useCase };
  });

  scored.sort((a, b) => b.score - a.score);

  // --- Combine: curated first, then best algorithmic to fill 5 slots ---
  const results: PairingResult[] = [...curatedResults.slice(0, 5)];

  if (results.length < 5) {
    // Add algorithmic results ensuring class diversity
    const usedClasses = new Set(results.map(r => getProfile(r.font).class));
    for (const candidate of scored) {
      if (results.length >= 5) break;
      const targetClass = getProfile(candidate.font).class;
      if (!usedClasses.has(targetClass)) {
        usedClasses.add(targetClass);
        results.push(candidate);
      }
    }
    // Fill any remaining slots
    for (const candidate of scored) {
      if (results.length >= 5) break;
      if (!results.some(r => r.font === candidate.font)) {
        results.push(candidate);
      }
    }
  }

  return results;
}
