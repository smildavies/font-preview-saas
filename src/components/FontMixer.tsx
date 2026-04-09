'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { type LocalFont } from '@/hooks/useLocalFonts'

interface FontMixerProps {
  fonts: LocalFont[]
  onClose: () => void
  isPro: boolean
  fontSource: 'local' | 'google'
  loadGoogleFont?: (family: string) => void
}

interface LetterAssignment {
  char: string
  fontFamily: string
}

interface LetterSeed {
  rot: number
  sizeJit: number
  baseShift: number
  opacity: number
  weight: number
  colorIdx: number
  bgHue: number
}

const MIXER_PALETTES: Record<string, string[]> = {
  rainbow:  ['#ef4444','#f97316','#eab308','#22c55e','#3b82f6','#8b5cf6','#ec4899'],
  neon:     ['#ff006e','#00f5d4','#fee440','#9b5de5','#00bbf9','#f15bb5','#90e0ef'],
  pastel:   ['#ffadad','#ffd6a5','#fdffb6','#caffbf','#9bf6ff','#a0c4ff','#bdb2ff','#ffc6ff'],
  earth:    ['#8B4513','#CD853F','#DEB887','#556B2F','#6B8E23','#8FBC8F','#A0522D'],
  mono:     ['#ffffff','#d4d4d4','#a3a3a3','#737373','#525252','#404040'],
  sunset:   ['#ff6b6b','#ffa502','#ff6348','#ff4757','#eccc68','#ffd32a','#ff5252'],
  ocean:    ['#0077b6','#00b4d8','#48cae4','#90e0ef','#ade8f4','#023e8a','#0096c7'],
  candy:    ['#ff69b4','#ff1493','#da70d6','#ba55d3','#9370db','#ff6eb4','#ff82ab'],
}

const MIXING_MODES = [
  { mode: 'random', label: 'Random' },
  { mode: 'alternating', label: 'Alternating' },
  { mode: 'per-word', label: 'Per Word' },
  { mode: 'serif-script', label: 'Serif + Script' },
  { mode: 'vowel-consonant', label: 'Vowels / Consonants' },
  { mode: 'style-class', label: 'Style Class Mix' },
  { mode: 'gradient-cycle', label: 'Gradient Cycle' },
  { mode: 'ransom', label: 'Ransom Note' },
  { mode: 'handwriting', label: 'Handwriting' },
  { mode: 'typewriter', label: 'Typewriter' },
] as const

type MixMode = typeof MIXING_MODES[number]['mode']

function pickRandom<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)] }

function classifyFontSimple(name: string): string {
  const lower = name.toLowerCase()
  if (/mono|code|console|terminal|courier/i.test(lower)) return 'monospace'
  if (/script|cursive|calligraph|hand|writing|brush|paint|ink|dancing|lobster|pacifico|satisfy|sacramento/i.test(lower)) return 'script'
  if (/display|poster|banner|headline|decorat|ornament|comic|cartoon|stencil|retro|vintage/i.test(lower)) return 'display'
  if (/serif|roman|garamond|caslon|baskerville|didot|bodoni|times|georgia|palatino|book|text/i.test(lower)) return 'serif'
  return 'sans-serif'
}

function generateSeeds(len: number): LetterSeed[] {
  return Array.from({ length: len }, () => ({
    rot: (Math.random() - 0.5) * 2,
    sizeJit: (Math.random() - 0.5) * 2,
    baseShift: (Math.random() - 0.5) * 2,
    opacity: 0.5 + Math.random() * 0.5,
    weight: pickRandom([300, 400, 400, 500, 600, 700, 800]),
    colorIdx: Math.floor(Math.random() * 8),
    bgHue: Math.random() * 360,
  }))
}

export default function FontMixer({ fonts, onClose, isPro, fontSource, loadGoogleFont }: FontMixerProps) {
  const [text, setText] = useState('HELLO')
  const [assignments, setAssignments] = useState<LetterAssignment[]>([])
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [fontSearch, setFontSearch] = useState('')
  const [fontSize, setFontSize] = useState(72)
  const [bgColor, setBgColor] = useState('#09090b')
  const [textColor, setTextColor] = useState('#ffffff')
  const textAlign = 'center' as const
  const [copied, setCopied] = useState(false)
  const canvasRef = useRef<HTMLDivElement>(null)
  const fontGridRef = useRef<HTMLDivElement>(null)

  // New features
  const [mode, setMode] = useState<MixMode>('random')
  const [palette, setPalette] = useState('rainbow')
  const [chaos, setChaos] = useState(0)
  const [rotation, setRotation] = useState(0)
  const [sizeJitter, setSizeJitter] = useState(0)
  const [baselineShift, setBaselineShift] = useState(0)
  const [colorPerLetter, setColorPerLetter] = useState(false)
  const [letterBg, setLetterBg] = useState(false)
  const [opacityVar, setOpacityVar] = useState(false)
  const [weightVar, setWeightVar] = useState(false)
  const [seeds, setSeeds] = useState<LetterSeed[]>([])

  // Escape key handler
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  const getFontsByClass = useCallback((cls: string) => {
    return fonts.filter(f => classifyFontSimple(f.family) === cls)
  }, [fonts])

  const loadFontIfGoogle = useCallback((family: string) => {
    if (fontSource === 'google' && loadGoogleFont) loadGoogleFont(family)
  }, [fontSource, loadGoogleFont])

  const applyMixMode = useCallback((currentMode: MixMode, currentAssignments: LetterAssignment[]) => {
    const shuffled = () => [...fonts].sort(() => Math.random() - 0.5)
    const newAssignments = [...currentAssignments]
    let newRotation = rotation, newSizeJitter = sizeJitter, newBaseline = baselineShift
    let newColorPerLetter = colorPerLetter, newLetterBg = letterBg, newOpacityVar = opacityVar

    if (currentMode === 'random') {
      const s = shuffled()
      newAssignments.forEach((a, i) => { a.fontFamily = s[i % s.length]?.family || a.fontFamily })
    } else if (currentMode === 'alternating') {
      const s = shuffled()
      const f1 = s[0]?.family, f2 = s[1]?.family || f1
      newAssignments.forEach((a, i) => { a.fontFamily = i % 2 === 0 ? f1 : f2 })
    } else if (currentMode === 'per-word') {
      const s = shuffled()
      let wordIdx = 0
      newAssignments.forEach((a, i) => {
        if (i > 0 && newAssignments[i - 1].char === ' ' && a.char !== ' ') wordIdx++
        a.fontFamily = s[wordIdx % s.length]?.family || a.fontFamily
      })
    } else if (currentMode === 'serif-script') {
      const serifs = getFontsByClass('serif'); const scripts = getFontsByClass('script')
      const s1 = serifs.length ? pickRandom(serifs).family : fonts[0]?.family
      const s2 = scripts.length ? pickRandom(scripts).family : fonts[1]?.family || fonts[0]?.family
      newAssignments.forEach((a, i) => { a.fontFamily = i % 2 === 0 ? s1 : s2 })
    } else if (currentMode === 'vowel-consonant') {
      const vowels = 'aeiouAEIOU'
      const s = shuffled()
      const f1 = s[0]?.family, f2 = s[1]?.family || f1
      newAssignments.forEach(a => { a.fontFamily = vowels.includes(a.char) ? f1 : f2 })
    } else if (currentMode === 'style-class') {
      const classes = ['serif', 'sans-serif', 'script', 'display', 'monospace']
      const picks = classes.map(c => { const f = getFontsByClass(c); return f.length ? pickRandom(f).family : null }).filter(Boolean) as string[]
      if (picks.length) newAssignments.forEach((a, i) => { a.fontFamily = picks[i % picks.length] })
    } else if (currentMode === 'gradient-cycle') {
      const s = shuffled().slice(0, 6)
      let ci = 0
      newAssignments.forEach(a => { if (a.char !== ' ') { a.fontFamily = s[ci % s.length]?.family || a.fontFamily; ci++ } })
    } else if (currentMode === 'ransom') {
      const s = shuffled()
      newAssignments.forEach((a, i) => { a.fontFamily = s[i % s.length]?.family || a.fontFamily })
      newRotation = 15; newSizeJitter = 30; newBaseline = 10; newLetterBg = true; newColorPerLetter = true
    } else if (currentMode === 'handwriting') {
      const scripts = getFontsByClass('script')
      const pool = scripts.length >= 3 ? scripts : fonts.filter(f => /hand|script|cursive|brush|writing/i.test(f.family))
      const picks = pool.length ? Array.from({ length: 5 }, () => pickRandom(pool).family) : [fonts[0]?.family]
      newAssignments.forEach((a, i) => { a.fontFamily = picks[i % picks.length] || a.fontFamily })
      newRotation = 5; newBaseline = 4; newSizeJitter = 10; newLetterBg = false; newColorPerLetter = false
    } else if (currentMode === 'typewriter') {
      const monos = getFontsByClass('monospace')
      const font = monos.length ? pickRandom(monos).family : 'Courier New'
      newAssignments.forEach(a => { a.fontFamily = font })
      newRotation = 2; newBaseline = 2; newSizeJitter = 5; newOpacityVar = true; newLetterBg = false; newColorPerLetter = false
    }

    // Load fonts
    const unique = [...new Set(newAssignments.map(a => a.fontFamily))]
    unique.forEach(f => loadFontIfGoogle(f))

    setAssignments(newAssignments)
    setRotation(newRotation)
    setSizeJitter(newSizeJitter)
    setBaselineShift(newBaseline)
    setColorPerLetter(newColorPerLetter)
    setLetterBg(newLetterBg)
    setOpacityVar(newOpacityVar)
    setSeeds(generateSeeds(newAssignments.length))
  }, [fonts, getFontsByClass, loadFontIfGoogle, rotation, sizeJitter, baselineShift, colorPerLetter, letterBg, opacityVar])

  // Initialize on mount
  useEffect(() => {
    if (assignments.length === 0 && fonts.length > 0) {
      const initial = text.split('').map(char => ({
        char,
        fontFamily: fonts[0]?.family || 'sans-serif',
      }))
      setAssignments(initial)
      setSeeds(generateSeeds(initial.length))

      // Auto-apply random mode
      const shuffled = [...fonts].sort(() => Math.random() - 0.5)
      const mixed = initial.map((a, i) => ({ ...a, fontFamily: shuffled[i % shuffled.length]?.family || a.fontFamily }))
      const unique = [...new Set(mixed.map(a => a.fontFamily))]
      unique.forEach(f => loadFontIfGoogle(f))
      setAssignments(mixed)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fonts])

  const updateText = useCallback((newText: string) => {
    setText(newText)
    setAssignments(prev => {
      const newA: LetterAssignment[] = []
      for (let i = 0; i < newText.length; i++) {
        if (i < prev.length && prev[i].char === newText[i]) {
          newA.push(prev[i])
        } else {
          newA.push({ char: newText[i], fontFamily: prev[0]?.fontFamily || fonts[0]?.family || 'sans-serif' })
        }
      }
      return newA
    })
    setSeeds(prev => {
      if (prev.length >= newText.length) return prev.slice(0, newText.length)
      return [...prev, ...generateSeeds(newText.length - prev.length)]
    })
  }, [fonts])

  const assignFont = (index: number, fontFamily: string) => {
    loadFontIfGoogle(fontFamily)
    setAssignments(prev => { const next = [...prev]; if (next[index]) next[index] = { ...next[index], fontFamily }; return next })
    setSelectedIndex(null)
    setFontSearch('')
  }

  const handleModeChange = (newMode: MixMode) => {
    setMode(newMode)
    applyMixMode(newMode, assignments)
  }

  const handleReshuffle = () => {
    applyMixMode(mode, assignments)
  }

  const handleReset = () => {
    const first = fonts[0]?.family || 'sans-serif'
    setAssignments(prev => prev.map(a => ({ ...a, fontFamily: first })))
    setRotation(0); setSizeJitter(0); setBaselineShift(0); setChaos(0)
    setColorPerLetter(false); setLetterBg(false); setOpacityVar(false); setWeightVar(false)
    setSeeds(generateSeeds(assignments.length))
  }

  const handlePaletteClick = (p: string) => {
    setPalette(p)
    setColorPerLetter(true)
  }

  // Export as PNG
  const exportPNG = async () => {
    if (!canvasRef.current) return
    const html2canvas = (await import('html2canvas')).default
    const canvas = await html2canvas(canvasRef.current, { backgroundColor: bgColor, scale: 2 })
    const link = document.createElement('a')
    link.download = `font-mix-${text.replace(/\s+/g, '-').toLowerCase()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  // Export as SVG
  const exportSVG = () => {
    const colors = MIXER_PALETTES[palette] || MIXER_PALETTES.rainbow
    const svgLetters = assignments.map((a, i) => {
      const x = i * (fontSize * 0.65)
      const seed = seeds[i]
      const c = colorPerLetter && seed ? colors[seed.colorIdx % colors.length] : textColor
      const ch = a.char === '&' ? '&amp;' : a.char === '<' ? '&lt;' : a.char === '>' ? '&gt;' : a.char
      return `<text x="${x}" y="${fontSize}" font-family="${a.fontFamily}, sans-serif" font-size="${fontSize}" fill="${c}">${ch}</text>`
    }).join('\n    ')
    const width = assignments.length * (fontSize * 0.65) + fontSize
    const height = fontSize * 1.4
    const svg = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">\n    <rect width="${width}" height="${height}" fill="${bgColor}"/>\n    ${svgLetters}\n</svg>`
    const blob = new Blob([svg], { type: 'image/svg+xml' })
    const link = document.createElement('a')
    link.download = `font-mix-${text.replace(/\s+/g, '-').toLowerCase()}.svg`
    link.href = URL.createObjectURL(blob)
    link.click()
  }

  const copyCSSRules = () => {
    const uniqueFonts = [...new Set(assignments.map(a => a.fontFamily))]
    const css = uniqueFonts.map((f, i) => `.letter-style-${i + 1} { font-family: "${f}", sans-serif; }`).join('\n')
    navigator.clipboard.writeText(css)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const copyHTML = () => {
    const colors = MIXER_PALETTES[palette] || MIXER_PALETTES.rainbow
    const html = assignments.map((a, i) => {
      const seed = seeds[i]
      const c = colorPerLetter && seed ? colors[seed.colorIdx % colors.length] : textColor
      return `<span style="font-family:'${a.fontFamily}',sans-serif;font-size:${fontSize}px;color:${c};">${a.char}</span>`
    }).join('')
    navigator.clipboard.writeText(html)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const filteredFonts = fontSearch ? fonts.filter(f => f.family.toLowerCase().includes(fontSearch.toLowerCase())) : fonts

  // Lazy-load Google Fonts
  useEffect(() => {
    if (fontSource !== 'google' || !loadGoogleFont || !fontGridRef.current) return
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const family = entry.target.getAttribute('data-font-family')
          if (family) loadGoogleFont(family)
          observer.unobserve(entry.target)
        }
      })
    }, { root: fontGridRef.current, rootMargin: '100px' })
    fontGridRef.current.querySelectorAll('[data-font-family]').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [fontSource, loadGoogleFont, fontSearch, selectedIndex])

  const paletteColors = MIXER_PALETTES[palette] || MIXER_PALETTES.rainbow
  const chaosMult = chaos / 100

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Font Mixer</h2>
              <p className="text-xs text-zinc-500">Click any letter to change its font</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white transition rounded-lg hover:bg-zinc-800">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Text Input + Controls */}
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Your Text</label>
              <input type="text" value={text} onChange={e => updateText(e.target.value.slice(0, 50))}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-white text-sm focus:border-violet-600 focus:outline-none focus:ring-1 focus:ring-violet-600"
                placeholder="Type your word..." maxLength={50} />
            </div>
            <div className="w-28">
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Size: {fontSize}px</label>
              <input type="range" min={24} max={160} value={fontSize} onChange={e => setFontSize(Number(e.target.value))} className="w-full accent-violet-600" />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Text</label>
              <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border border-zinc-700 bg-transparent" />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">BG</label>
              <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border border-zinc-700 bg-transparent" />
            </div>
          </div>

          {/* Mixing Modes */}
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-zinc-500 mb-2">Mixing Mode</label>
            <div className="flex flex-wrap gap-1.5">
              {MIXING_MODES.map(m => (
                <button key={m.mode} onClick={() => handleModeChange(m.mode)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                    mode === m.mode ? 'bg-violet-600/20 text-violet-400 border border-violet-600/30'
                      : m.mode === 'ransom' ? 'text-pink-400 border border-pink-600/30 hover:bg-pink-600/10'
                      : m.mode === 'handwriting' ? 'text-amber-400 border border-amber-600/30 hover:bg-amber-600/10'
                      : m.mode === 'serif-script' ? 'text-emerald-400 border border-emerald-600/30 hover:bg-emerald-600/10'
                      : 'text-zinc-400 border border-zinc-700 hover:bg-zinc-800'
                  }`}>
                  {m.label}
                </button>
              ))}
              <button onClick={handleReset}
                className="px-2.5 py-1 rounded-lg text-xs font-medium text-zinc-500 border border-zinc-700 hover:bg-zinc-800 transition">
                Reset All
              </button>
            </div>
          </div>

          {/* Effects */}
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-zinc-500 mb-2">Effects</label>
            <div className="flex flex-wrap gap-x-5 gap-y-3 items-end">
              <div className="w-28">
                <label className="block text-xs text-zinc-400 mb-1">Chaos: {chaos}%</label>
                <input type="range" min={0} max={100} value={chaos} onChange={e => setChaos(Number(e.target.value))} className="w-full accent-violet-600" />
              </div>
              <div className="w-28">
                <label className="block text-xs text-zinc-400 mb-1">Rotation: {rotation}&deg;</label>
                <input type="range" min={0} max={30} value={rotation} onChange={e => setRotation(Number(e.target.value))} className="w-full accent-violet-600" />
              </div>
              <div className="w-28">
                <label className="block text-xs text-zinc-400 mb-1">Size Jitter: {sizeJitter}%</label>
                <input type="range" min={0} max={60} value={sizeJitter} onChange={e => setSizeJitter(Number(e.target.value))} className="w-full accent-violet-600" />
              </div>
              <div className="w-28">
                <label className="block text-xs text-zinc-400 mb-1">Baseline: {baselineShift}px</label>
                <input type="range" min={0} max={20} value={baselineShift} onChange={e => setBaselineShift(Number(e.target.value))} className="w-full accent-violet-600" />
              </div>
              <label className="flex items-center gap-1.5 text-xs text-zinc-400 cursor-pointer">
                <input type="checkbox" checked={colorPerLetter} onChange={e => setColorPerLetter(e.target.checked)} className="accent-violet-600" /> Color per letter
              </label>
              <label className="flex items-center gap-1.5 text-xs text-zinc-400 cursor-pointer">
                <input type="checkbox" checked={letterBg} onChange={e => setLetterBg(e.target.checked)} className="accent-violet-600" /> Letter backgrounds
              </label>
              <label className="flex items-center gap-1.5 text-xs text-zinc-400 cursor-pointer">
                <input type="checkbox" checked={opacityVar} onChange={e => setOpacityVar(e.target.checked)} className="accent-violet-600" /> Opacity variation
              </label>
              <label className="flex items-center gap-1.5 text-xs text-zinc-400 cursor-pointer">
                <input type="checkbox" checked={weightVar} onChange={e => setWeightVar(e.target.checked)} className="accent-violet-600" /> Weight variation
              </label>
            </div>
          </div>

          {/* Color Palette */}
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-zinc-500 mb-2">
              Color Palette <span className="opacity-50">(for color-per-letter mode)</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {Object.keys(MIXER_PALETTES).map(p => (
                <button key={p} onClick={() => handlePaletteClick(p)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition capitalize ${
                    palette === p ? 'bg-violet-600/20 text-violet-400 border border-violet-600/30' : 'text-zinc-400 border border-zinc-700 hover:bg-zinc-800'
                  }`}>
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Reshuffle */}
          <div className="flex items-center gap-2">
            <button onClick={handleReshuffle}
              className="ml-auto px-3 py-1.5 rounded-lg text-xs font-medium bg-violet-600/20 text-violet-400 border border-violet-600/30 hover:bg-violet-600/30 transition">
              Re-shuffle
            </button>
          </div>

          {/* Live Preview Canvas */}
          <div ref={canvasRef}
            className="rounded-xl border border-zinc-700 p-8 min-h-[120px] flex items-center flex-wrap gap-0 overflow-hidden"
            style={{ backgroundColor: bgColor, justifyContent: textAlign === 'left' ? 'flex-start' : textAlign === 'right' ? 'flex-end' : 'center' }}>
            {assignments.map((a, i) => {
              const seed = seeds[i] || { rot: 0, sizeJit: 0, baseShift: 0, opacity: 1, weight: 400, colorIdx: i, bgHue: 0 }
              const rot = rotation * seed.rot + (chaos > 0 ? chaosMult * 15 * seed.rot : 0)
              const sizeOff = fontSize * (sizeJitter / 100) * seed.sizeJit + (chaos > 0 ? chaosMult * fontSize * 0.2 * seed.sizeJit : 0)
              const finalSize = Math.max(12, Math.round(fontSize + sizeOff))
              const bShift = baselineShift * seed.baseShift + (chaos > 0 ? chaosMult * 8 * seed.baseShift : 0)
              const finalColor = colorPerLetter ? paletteColors[seed.colorIdx % paletteColors.length] : textColor
              const finalOpacity = opacityVar ? seed.opacity : 1
              const finalWeight = weightVar ? seed.weight : undefined

              return (
                <span key={`${i}-${a.char}`}
                  onClick={() => setSelectedIndex(selectedIndex === i ? null : i)}
                  className={`cursor-pointer transition-all inline-block ${selectedIndex === i ? 'ring-2 ring-violet-500 ring-offset-2 ring-offset-zinc-900 rounded' : ''} ${a.char === ' ' ? 'w-[0.3em]' : ''}`}
                  style={{
                    fontFamily: `"${a.fontFamily}", sans-serif`,
                    fontSize: `${finalSize}px`,
                    color: finalColor,
                    lineHeight: 1.2,
                    transform: `rotate(${rot.toFixed(1)}deg) translateY(${bShift.toFixed(1)}px)`,
                    opacity: finalOpacity,
                    fontWeight: finalWeight,
                    ...(letterBg && a.char !== ' ' ? {
                      background: `hsl(${seed.bgHue}, 60%, 85%)`,
                      padding: '4px 2px',
                      borderRadius: '3px',
                      margin: '2px',
                      border: `1px solid hsl(${seed.bgHue}, 40%, 70%)`,
                    } : {}),
                  }}
                  title={`${a.char} — ${a.fontFamily}`}>
                  {a.char === ' ' ? '\u00A0' : a.char}
                </span>
              )
            })}
          </div>

          {/* Letter-Font Legend */}
          <div className="flex flex-wrap gap-2">
            {assignments.map((a, origIdx) => ({ a, origIdx })).filter(({ a }) => a.char !== ' ').map(({ a, origIdx }) => (
              <div key={origIdx} onClick={() => setSelectedIndex(origIdx)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs cursor-pointer transition ${
                  selectedIndex === origIdx ? 'bg-violet-600/20 border border-violet-600/40 text-violet-400' : 'bg-zinc-800 border border-zinc-700 text-zinc-400 hover:border-zinc-600'
                }`}>
                <span className="font-bold text-white" style={{ fontFamily: `"${a.fontFamily}", sans-serif` }}>{a.char}</span>
                <span className="truncate max-w-[120px]">{a.fontFamily}</span>
              </div>
            ))}
          </div>

          {/* Font Picker */}
          {selectedIndex !== null && (
            <div className="rounded-xl border border-violet-600/40 bg-zinc-800/80 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-white">
                  Pick a font for &ldquo;<span className="text-violet-400">{assignments[selectedIndex]?.char}</span>&rdquo;
                </span>
                <button onClick={() => setSelectedIndex(null)} className="text-xs text-zinc-500 hover:text-white">Close</button>
              </div>
              <input type="text" value={fontSearch} onChange={e => setFontSearch(e.target.value)} placeholder="Search fonts..."
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-violet-600 focus:outline-none mb-3" autoFocus />
              <div ref={fontGridRef} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                {filteredFonts.map(f => (
                  <button key={f.familyId} data-font-family={fontSource === 'google' ? f.family : undefined}
                    onClick={() => assignFont(selectedIndex, f.family)}
                    className={`text-left px-3 py-2 rounded-lg transition ${
                      assignments[selectedIndex]?.fontFamily === f.family ? 'bg-violet-600/20 border border-violet-600/40 text-violet-400' : 'bg-zinc-900 border border-zinc-700 text-zinc-300 hover:border-violet-600/40'
                    }`}>
                    <span className="block text-sm leading-tight truncate" style={{ fontFamily: `"${f.family}", sans-serif` }}>Abc</span>
                    <span className="block text-[11px] opacity-60 truncate" style={{ fontFamily: 'Tahoma, Arial, sans-serif' }}>{f.family}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Export Actions */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button onClick={exportPNG} className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-violet-600 hover:bg-violet-500 text-white transition">Export PNG</button>
            <button onClick={exportSVG} className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition">Export SVG (Cricut)</button>
            <button onClick={copyCSSRules} className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 transition">{copied ? 'Copied!' : 'Copy CSS'}</button>
            <button onClick={copyHTML} className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 transition">Copy HTML</button>
          </div>
        </div>
      </div>
    </div>
  )
}
