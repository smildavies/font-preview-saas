'use client'

import { useState, useCallback, useRef } from 'react'
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

// AI mixing strategies
const MIXING_STRATEGIES = [
  { name: 'Alternating', description: 'Alternate between two fonts', fn: (fonts: string[]) => fonts.length >= 2 ? [fonts[0], fonts[1]] : fonts },
  { name: 'Serif + Script', description: 'Pair serif with script fonts', keywords: [['serif', 'roman', 'times', 'garamond', 'georgia', 'bodoni', 'didot', 'caslon'], ['script', 'cursive', 'brush', 'hand', 'callig', 'pacifico', 'dancing', 'satisfy']] },
  { name: 'Bold + Light', description: 'Mix heavy and thin weights', keywords: [['bold', 'black', 'heavy', 'ultra', 'impact'], ['light', 'thin', 'hairline', 'extralight']] },
  { name: 'Modern + Vintage', description: 'Contrast modern and classic', keywords: [['futura', 'helvetica', 'arial', 'roboto', 'montserrat', 'poppins', 'inter', 'lato'], ['garamond', 'caslon', 'baskerville', 'bodoni', 'didot', 'playfair', 'merriweather']] },
  { name: 'Whimsical Mix', description: 'Fun, playful combinations', keywords: [['comic', 'papyrus', 'marker', 'chalk', 'crayon', 'fredoka', 'bubblegum', 'bangers', 'lobster'], ['sans', 'arial', 'verdana', 'roboto', 'open sans']] },
]

function findFontsByKeywords(fonts: LocalFont[], keywords: string[]): string[] {
  return fonts
    .filter(f => keywords.some(kw => f.family.toLowerCase().includes(kw) || (f.style && f.style.toLowerCase().includes(kw))))
    .map(f => f.family)
    .slice(0, 10)
}

export default function FontMixer({ fonts, onClose, isPro, fontSource, loadGoogleFont }: FontMixerProps) {
  const [text, setText] = useState('HELLO')
  const [assignments, setAssignments] = useState<LetterAssignment[]>([])
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [fontSearch, setFontSearch] = useState('')
  const [fontSize, setFontSize] = useState(72)
  const [bgColor, setBgColor] = useState('#09090b')
  const [textColor, setTextColor] = useState('#ffffff')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const canvasRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)

  // Initialize assignments when text changes
  const updateText = useCallback((newText: string) => {
    setText(newText)
    setAssignments(prev => {
      const newAssignments: LetterAssignment[] = []
      for (let i = 0; i < newText.length; i++) {
        if (i < prev.length && prev[i].char === newText[i]) {
          newAssignments.push(prev[i])
        } else {
          newAssignments.push({
            char: newText[i],
            fontFamily: prev[0]?.fontFamily || fonts[0]?.family || 'sans-serif',
          })
        }
      }
      return newAssignments
    })
  }, [fonts])

  // Set initial assignments
  useState(() => {
    const initial = text.split('').map(char => ({
      char,
      fontFamily: fonts[0]?.family || 'sans-serif',
    }))
    setAssignments(initial)
  })

  const assignFont = (index: number, fontFamily: string) => {
    if (fontSource === 'google' && loadGoogleFont) {
      loadGoogleFont(fontFamily)
    }
    setAssignments(prev => {
      const next = [...prev]
      if (next[index]) {
        next[index] = { ...next[index], fontFamily }
      }
      return next
    })
    setSelectedIndex(null)
    setFontSearch('')
  }

  const assignFontToAll = (fontFamily: string) => {
    if (fontSource === 'google' && loadGoogleFont) {
      loadGoogleFont(fontFamily)
    }
    setAssignments(prev => prev.map(a => ({ ...a, fontFamily })))
  }

  // AI Suggest — apply a mixing strategy
  const applySuggestion = (strategyIndex: number) => {
    const strategy = MIXING_STRATEGIES[strategyIndex]
    let fontPair: string[] = []

    if (strategy.fn) {
      // Use top 2 most common assigned fonts
      const usedFonts = [...new Set(assignments.map(a => a.fontFamily))]
      if (usedFonts.length >= 2) {
        fontPair = strategy.fn(usedFonts)
      } else {
        fontPair = [usedFonts[0] || fonts[0]?.family, fonts[1]?.family || fonts[0]?.family]
      }
    } else if (strategy.keywords) {
      const group1 = findFontsByKeywords(fonts, strategy.keywords[0])
      const group2 = findFontsByKeywords(fonts, strategy.keywords[1])
      if (group1.length && group2.length) {
        fontPair = [group1[Math.floor(Math.random() * group1.length)], group2[Math.floor(Math.random() * group2.length)]]
      } else {
        // Fallback: pick two random fonts
        const shuffled = [...fonts].sort(() => Math.random() - 0.5)
        fontPair = [shuffled[0]?.family || 'sans-serif', shuffled[1]?.family || shuffled[0]?.family || 'sans-serif']
      }
    }

    if (fontPair.length >= 2) {
      if (fontSource === 'google' && loadGoogleFont) {
        fontPair.forEach(f => loadGoogleFont(f))
      }
      setAssignments(prev =>
        prev.map((a, i) => ({
          ...a,
          fontFamily: fontPair[i % fontPair.length],
        }))
      )
    }
    setShowSuggestions(false)
  }

  // Randomize all letters
  const randomize = () => {
    const shuffled = [...fonts].sort(() => Math.random() - 0.5).slice(0, Math.min(assignments.length, 8))
    if (fontSource === 'google' && loadGoogleFont) {
      shuffled.forEach(f => loadGoogleFont(f.family))
    }
    setAssignments(prev =>
      prev.map((a, i) => ({
        ...a,
        fontFamily: shuffled[i % shuffled.length]?.family || a.fontFamily,
      }))
    )
  }

  // Export as PNG
  const exportPNG = async () => {
    if (!canvasRef.current) return
    const html2canvas = (await import('html2canvas')).default
    const canvas = await html2canvas(canvasRef.current, {
      backgroundColor: bgColor,
      scale: 2,
    })
    const link = document.createElement('a')
    link.download = `font-mix-${text.replace(/\s+/g, '-').toLowerCase()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  // Export as SVG
  const exportSVG = () => {
    const svgLetters = assignments.map((a, i) => {
      const x = i * (fontSize * 0.65)
      return `<text x="${x}" y="${fontSize}" font-family="${a.fontFamily}, sans-serif" font-size="${fontSize}" fill="${textColor}">${a.char === '&' ? '&amp;' : a.char === '<' ? '&lt;' : a.char === '>' ? '&gt;' : a.char}</text>`
    }).join('\n    ')

    const width = assignments.length * (fontSize * 0.65) + fontSize
    const height = fontSize * 1.4

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    ${svgLetters}
</svg>`

    const blob = new Blob([svg], { type: 'image/svg+xml' })
    const link = document.createElement('a')
    link.download = `font-mix-${text.replace(/\s+/g, '-').toLowerCase()}.svg`
    link.href = URL.createObjectURL(blob)
    link.click()
    URL.revokeObjectURL(link.href)
  }

  // Copy CSS
  const copyCSSRules = () => {
    const uniqueFonts = [...new Set(assignments.map(a => a.fontFamily))]
    const css = uniqueFonts.map((f, i) => `.letter-style-${i + 1} { font-family: "${f}", sans-serif; }`).join('\n')
    navigator.clipboard.writeText(css)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const filteredFonts = fontSearch
    ? fonts.filter(f => f.family.toLowerCase().includes(fontSearch.toLowerCase())).slice(0, 50)
    : fonts.slice(0, 50)

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

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Text Input + Controls */}
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Your Text</label>
              <input
                type="text"
                value={text}
                onChange={e => updateText(e.target.value.slice(0, 30))}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-white text-sm focus:border-violet-600 focus:outline-none focus:ring-1 focus:ring-violet-600"
                placeholder="Type your word..."
                maxLength={30}
              />
            </div>
            <div className="w-28">
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Size</label>
              <input
                type="range"
                min={24}
                max={120}
                value={fontSize}
                onChange={e => setFontSize(Number(e.target.value))}
                className="w-full accent-violet-600"
              />
              <span className="text-xs text-zinc-500">{fontSize}px</span>
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

          {/* AI Suggestion Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={randomize}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-violet-600/20 text-violet-400 border border-violet-600/30 hover:bg-violet-600/30 transition"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M2.985 19.644l3.181-3.183" />
              </svg>
              Randomize
            </button>
            <div className="relative">
              <button
                onClick={() => setShowSuggestions(!showSuggestions)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600/20 text-emerald-400 border border-emerald-600/30 hover:bg-emerald-600/30 transition"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
                AI Mix Styles
              </button>
              {showSuggestions && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-zinc-800 border border-zinc-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                  {MIXING_STRATEGIES.map((s, i) => (
                    <button
                      key={s.name}
                      onClick={() => applySuggestion(i)}
                      className="w-full text-left px-4 py-3 hover:bg-zinc-700/50 transition border-b border-zinc-700/50 last:border-b-0"
                    >
                      <span className="text-sm text-white font-medium">{s.name}</span>
                      <span className="block text-xs text-zinc-500">{s.description}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => assignFontToAll(fonts[0]?.family || 'sans-serif')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-800 text-zinc-400 border border-zinc-700 hover:bg-zinc-700 transition"
            >
              Reset All
            </button>
          </div>

          {/* Live Preview Canvas */}
          <div
            ref={canvasRef}
            className="rounded-xl border border-zinc-700 p-8 min-h-[120px] flex items-center justify-center flex-wrap gap-0"
            style={{ backgroundColor: bgColor }}
          >
            {assignments.map((a, i) => (
              <span
                key={`${i}-${a.char}`}
                onClick={() => setSelectedIndex(selectedIndex === i ? null : i)}
                className={`cursor-pointer transition-all hover:scale-110 inline-block ${
                  selectedIndex === i ? 'ring-2 ring-violet-500 ring-offset-2 ring-offset-zinc-900 rounded' : ''
                } ${a.char === ' ' ? 'w-[0.3em]' : ''}`}
                style={{
                  fontFamily: `"${a.fontFamily}", sans-serif`,
                  fontSize: `${fontSize}px`,
                  color: textColor,
                  lineHeight: 1.2,
                }}
                title={`${a.char} — ${a.fontFamily}`}
              >
                {a.char === ' ' ? '\u00A0' : a.char}
              </span>
            ))}
          </div>

          {/* Letter-Font Legend */}
          <div className="flex flex-wrap gap-2">
            {assignments.filter(a => a.char !== ' ').map((a, i) => (
              <div
                key={i}
                onClick={() => setSelectedIndex(i)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs cursor-pointer transition ${
                  selectedIndex === i
                    ? 'bg-violet-600/20 border border-violet-600/40 text-violet-400'
                    : 'bg-zinc-800 border border-zinc-700 text-zinc-400 hover:border-zinc-600'
                }`}
              >
                <span className="font-bold text-white" style={{ fontFamily: `"${a.fontFamily}", sans-serif` }}>
                  {a.char}
                </span>
                <span className="truncate max-w-[120px]">{a.fontFamily}</span>
              </div>
            ))}
          </div>

          {/* Font Picker (shows when a letter is selected) */}
          {selectedIndex !== null && (
            <div className="rounded-xl border border-violet-600/40 bg-zinc-800/80 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-white">
                  Pick a font for &ldquo;<span className="text-violet-400">{assignments[selectedIndex]?.char}</span>&rdquo;
                </span>
                <button onClick={() => setSelectedIndex(null)} className="text-xs text-zinc-500 hover:text-white">
                  Close
                </button>
              </div>
              <input
                type="text"
                value={fontSearch}
                onChange={e => setFontSearch(e.target.value)}
                placeholder="Search fonts..."
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-violet-600 focus:outline-none mb-3"
                autoFocus
              />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                {filteredFonts.map(f => (
                  <button
                    key={f.familyId}
                    onClick={() => assignFont(selectedIndex, f.family)}
                    className={`text-left px-3 py-2 rounded-lg text-xs transition truncate ${
                      assignments[selectedIndex]?.fontFamily === f.family
                        ? 'bg-violet-600/20 border border-violet-600/40 text-violet-400'
                        : 'bg-zinc-900 border border-zinc-700 text-zinc-300 hover:border-violet-600/40'
                    }`}
                    style={{ fontFamily: `"${f.family}", sans-serif` }}
                  >
                    {f.family}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Export Actions */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={exportPNG}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-violet-600 hover:bg-violet-500 text-white transition"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Export PNG
            </button>
            <button
              onClick={exportSVG}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Export SVG (Cricut / Silhouette)
            </button>
            <button
              onClick={copyCSSRules}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 transition"
            >
              {copied ? 'Copied!' : 'Copy CSS'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
