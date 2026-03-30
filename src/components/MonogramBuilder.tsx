'use client'

import { useState, useRef } from 'react'
import { type LocalFont } from '@/hooks/useLocalFonts'

interface MonogramBuilderProps {
  fonts: LocalFont[]
  onClose: () => void
  fontSource: 'local' | 'google'
  loadGoogleFont?: (family: string) => void
}

const FRAME_STYLES = [
  { name: 'None', border: 'none', padding: '0' },
  { name: 'Circle', border: '3px solid', borderRadius: '50%', padding: '40px' },
  { name: 'Square', border: '3px solid', borderRadius: '0', padding: '40px' },
  { name: 'Rounded', border: '3px solid', borderRadius: '16px', padding: '40px' },
  { name: 'Double Circle', border: '3px double', borderRadius: '50%', padding: '40px' },
  { name: 'Diamond', border: '3px solid', borderRadius: '0', padding: '40px', transform: 'rotate(45deg)' },
  { name: 'Thin Circle', border: '1px solid', borderRadius: '50%', padding: '40px' },
  { name: 'Thick Square', border: '5px solid', borderRadius: '0', padding: '40px' },
]

const COLOR_PRESETS = [
  { name: 'Classic Gold', text: '#D4AF37', frame: '#D4AF37', bg: '#1a1a2e' },
  { name: 'Rose Gold', text: '#E8A598', frame: '#E8A598', bg: '#2d1b2e' },
  { name: 'Silver', text: '#C0C0C0', frame: '#C0C0C0', bg: '#1a1a1a' },
  { name: 'Navy & Gold', text: '#D4AF37', frame: '#D4AF37', bg: '#0a1628' },
  { name: 'Blush', text: '#2d1b2e', frame: '#2d1b2e', bg: '#f5e6e0' },
  { name: 'Sage', text: '#2d3a2e', frame: '#5a7a5e', bg: '#e8ede4' },
  { name: 'Modern White', text: '#111111', frame: '#111111', bg: '#ffffff' },
  { name: 'Vintage Cream', text: '#5c4033', frame: '#8b6b4a', bg: '#f5f0e8' },
]

export default function MonogramBuilder({ fonts, onClose, fontSource, loadGoogleFont }: MonogramBuilderProps) {
  const [letters, setLetters] = useState('ABC')
  const [mainFont, setMainFont] = useState(fonts[0]?.family || 'serif')
  const [frameIndex, setFrameIndex] = useState(1) // Circle default
  const [colorPreset, setColorPreset] = useState(0)
  const [fontSize, setFontSize] = useState(80)
  const [middleLarger, setMiddleLarger] = useState(true) // Traditional: middle initial larger
  const [fontSearch, setFontSearch] = useState('')
  const canvasRef = useRef<HTMLDivElement>(null)

  const colors = COLOR_PRESETS[colorPreset]
  const frame = FRAME_STYLES[frameIndex]

  const handleFontChange = (family: string) => {
    if (fontSource === 'google' && loadGoogleFont) loadGoogleFont(family)
    setMainFont(family)
  }

  const exportPNG = async () => {
    if (!canvasRef.current) return
    const html2canvas = (await import('html2canvas')).default
    const canvas = await html2canvas(canvasRef.current, { backgroundColor: null, scale: 3 })
    const link = document.createElement('a')
    link.download = `monogram-${letters.toLowerCase()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const exportSVG = () => {
    const size = 300
    const cx = size / 2
    const cy = size / 2

    let frameEl = ''
    if (frameIndex === 1 || frameIndex === 4 || frameIndex === 6) {
      // Circle variants
      const strokeWidth = frameIndex === 6 ? 1 : frameIndex === 4 ? 3 : 3
      frameEl = `<circle cx="${cx}" cy="${cy}" r="${cx - 20}" fill="none" stroke="${colors.frame}" stroke-width="${strokeWidth}" ${frameIndex === 4 ? 'stroke-dasharray="none"' : ''}/>`
      if (frameIndex === 4) {
        frameEl += `\n    <circle cx="${cx}" cy="${cy}" r="${cx - 28}" fill="none" stroke="${colors.frame}" stroke-width="1.5"/>`
      }
    } else if (frameIndex === 2 || frameIndex === 7) {
      const sw = frameIndex === 7 ? 5 : 3
      frameEl = `<rect x="15" y="15" width="${size - 30}" height="${size - 30}" fill="none" stroke="${colors.frame}" stroke-width="${sw}"/>`
    } else if (frameIndex === 3) {
      frameEl = `<rect x="15" y="15" width="${size - 30}" height="${size - 30}" rx="16" fill="none" stroke="${colors.frame}" stroke-width="3"/>`
    }

    const letterEls = letters.split('').map((ch, i) => {
      const total = letters.length
      const spacing = total <= 1 ? 0 : (size - 80) / (total - 1)
      const x = total <= 1 ? cx : 40 + i * spacing
      const isMiddle = middleLarger && total === 3 && i === 1
      const fs = isMiddle ? fontSize * 1.4 : fontSize
      return `<text x="${x}" y="${cy + fs * 0.35}" font-family="${mainFont}, serif" font-size="${fs}" fill="${colors.text}" text-anchor="middle">${ch}</text>`
    }).join('\n    ')

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" fill="${colors.bg}" rx="8"/>
    ${frameEl}
    ${letterEls}
</svg>`

    const blob = new Blob([svg], { type: 'image/svg+xml' })
    const link = document.createElement('a')
    link.download = `monogram-${letters.toLowerCase()}.svg`
    link.href = URL.createObjectURL(blob)
    link.click()
    URL.revokeObjectURL(link.href)
  }

  const filteredFonts = fontSearch
    ? fonts.filter(f => f.family.toLowerCase().includes(fontSearch.toLowerCase())).slice(0, 40)
    : fonts.slice(0, 40)

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-rose-500 flex items-center justify-center text-white font-bold text-sm">
              M
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Monogram Builder</h2>
              <p className="text-xs text-zinc-500">Create beautiful monograms for wedding invites, gifts & crafts</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white transition rounded-lg hover:bg-zinc-800">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Controls */}
            <div className="space-y-5">
              {/* Letters */}
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Initials (1-3 letters)</label>
                <input
                  type="text"
                  value={letters}
                  onChange={e => setLetters(e.target.value.toUpperCase().slice(0, 3))}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-white text-2xl text-center tracking-[0.5em] focus:border-violet-600 focus:outline-none"
                  maxLength={3}
                />
              </div>

              {/* Middle larger toggle */}
              {letters.length === 3 && (
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={middleLarger}
                    onChange={e => setMiddleLarger(e.target.checked)}
                    className="rounded border-zinc-600 bg-zinc-800 text-violet-600 focus:ring-violet-600"
                  />
                  <span className="text-sm text-zinc-300">Traditional style (middle initial larger)</span>
                </label>
              )}

              {/* Font picker */}
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Font</label>
                <input
                  type="text"
                  value={fontSearch}
                  onChange={e => setFontSearch(e.target.value)}
                  placeholder="Search fonts..."
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-violet-600 focus:outline-none mb-2"
                />
                <div className="grid grid-cols-2 gap-1.5 max-h-32 overflow-y-auto">
                  {filteredFonts.map(f => (
                    <button
                      key={f.familyId}
                      onClick={() => handleFontChange(f.family)}
                      className={`text-left px-2.5 py-1.5 rounded text-xs truncate transition ${
                        mainFont === f.family
                          ? 'bg-violet-600/20 border border-violet-600/40 text-violet-400'
                          : 'bg-zinc-800 border border-zinc-700/50 text-zinc-400 hover:border-zinc-600'
                      }`}
                      style={{ fontFamily: `"${f.family}", serif` }}
                    >
                      {f.family}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Size: {fontSize}px</label>
                <input type="range" min={32} max={140} value={fontSize} onChange={e => setFontSize(Number(e.target.value))} className="w-full accent-violet-600" />
              </div>

              {/* Frame */}
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Frame</label>
                <div className="flex flex-wrap gap-2">
                  {FRAME_STYLES.map((f, i) => (
                    <button
                      key={f.name}
                      onClick={() => setFrameIndex(i)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                        frameIndex === i
                          ? 'bg-violet-600/20 text-violet-400 border border-violet-600/40'
                          : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-zinc-600'
                      }`}
                    >
                      {f.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Presets */}
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Color Theme</label>
                <div className="grid grid-cols-4 gap-2">
                  {COLOR_PRESETS.map((c, i) => (
                    <button
                      key={c.name}
                      onClick={() => setColorPreset(i)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-lg transition ${
                        colorPreset === i ? 'ring-2 ring-violet-500' : 'hover:bg-zinc-800'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full border border-zinc-600 flex items-center justify-center" style={{ backgroundColor: c.bg }}>
                        <span style={{ color: c.text, fontSize: '12px', fontWeight: 'bold' }}>A</span>
                      </div>
                      <span className="text-[10px] text-zinc-500">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Preview + Export */}
            <div className="space-y-4">
              <div
                ref={canvasRef}
                className="rounded-xl border border-zinc-700 flex items-center justify-center aspect-square"
                style={{ backgroundColor: colors.bg }}
              >
                <div
                  className="flex items-center justify-center"
                  style={{
                    border: frame.border !== 'none' ? `${frame.border} ${colors.frame}` : 'none',
                    borderRadius: frame.borderRadius || '0',
                    padding: frame.padding || '0',
                    transform: frame.transform || 'none',
                    width: frame.border !== 'none' ? '70%' : 'auto',
                    height: frame.border !== 'none' ? '70%' : 'auto',
                  }}
                >
                  <div style={{ transform: frame.transform ? 'rotate(-45deg)' : 'none' }} className="flex items-baseline gap-1">
                    {letters.split('').map((ch, i) => {
                      const isMiddle = middleLarger && letters.length === 3 && i === 1
                      return (
                        <span
                          key={i}
                          style={{
                            fontFamily: `"${mainFont}", serif`,
                            fontSize: `${isMiddle ? fontSize * 1.4 : fontSize}px`,
                            color: colors.text,
                            lineHeight: 1,
                          }}
                        >
                          {ch}
                        </span>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Export buttons */}
              <div className="flex gap-3">
                <button onClick={exportPNG} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-violet-600 hover:bg-violet-500 text-white transition">
                  Export PNG
                </button>
                <button onClick={exportSVG} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition">
                  Export SVG
                </button>
              </div>
              <p className="text-xs text-zinc-500 text-center">SVG works with Cricut Design Space & Silhouette Studio</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
