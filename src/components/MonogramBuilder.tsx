'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
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

const FAVORITES_KEY = 'monogram-font-favorites'
const MAX_FAVORITES = 10

function loadFavorites(): string[] {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed)) return parsed.slice(0, MAX_FAVORITES)
    }
  } catch {}
  return []
}

function saveFavorites(favs: string[]) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs.slice(0, MAX_FAVORITES)))
}

export default function MonogramBuilder({ fonts, onClose, fontSource, loadGoogleFont }: MonogramBuilderProps) {
  const [letters, setLetters] = useState('ABC')
  const [mainFont, setMainFont] = useState(fonts[0]?.family || 'serif')
  const [frameIndex, setFrameIndex] = useState(1) // Circle default
  const [fontSize, setFontSize] = useState(80)
  const [middleLarger, setMiddleLarger] = useState(true)
  const [fontSearch, setFontSearch] = useState('')

  // Self-selection colors
  const [textColor, setTextColor] = useState('#D4AF37')
  const [frameColor, setFrameColor] = useState('#D4AF37')
  const [previewBg, setPreviewBg] = useState('#1a1a2e')

  // Font favorites
  const [favorites, setFavorites] = useState<string[]>([])
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  const canvasRef = useRef<HTMLDivElement>(null)
  const fontGridRef = useRef<HTMLDivElement>(null)

  // Load favorites from localStorage on mount
  useEffect(() => {
    setFavorites(loadFavorites())
  }, [])

  // Escape key handler
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  // Lazy-load Google Fonts as they appear in the picker grid
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
  }, [fontSource, loadGoogleFont, fontSearch])

  // Toast auto-dismiss
  useEffect(() => {
    if (!toastMsg) return
    const t = setTimeout(() => setToastMsg(null), 2500)
    return () => clearTimeout(t)
  }, [toastMsg])

  const frame = FRAME_STYLES[frameIndex]

  const handleFontChange = (family: string) => {
    if (fontSource === 'google' && loadGoogleFont) loadGoogleFont(family)
    setMainFont(family)
  }

  const toggleFavorite = useCallback((family: string) => {
    setFavorites(prev => {
      if (prev.includes(family)) {
        const next = prev.filter(f => f !== family)
        saveFavorites(next)
        return next
      }
      if (prev.length >= MAX_FAVORITES) {
        setToastMsg(`Maximum ${MAX_FAVORITES} favorites reached. Remove one first.`)
        return prev
      }
      const next = [...prev, family]
      saveFavorites(next)
      return next
    })
  }, [])

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
      const strokeWidth = frameIndex === 6 ? 1 : frameIndex === 4 ? 3 : 3
      frameEl = `<circle cx="${cx}" cy="${cy}" r="${cx - 20}" fill="none" stroke="${frameColor}" stroke-width="${strokeWidth}" ${frameIndex === 4 ? 'stroke-dasharray="none"' : ''}/>`
      if (frameIndex === 4) {
        frameEl += `\n    <circle cx="${cx}" cy="${cy}" r="${cx - 28}" fill="none" stroke="${frameColor}" stroke-width="1.5"/>`
      }
    } else if (frameIndex === 2 || frameIndex === 7) {
      const sw = frameIndex === 7 ? 5 : 3
      frameEl = `<rect x="15" y="15" width="${size - 30}" height="${size - 30}" fill="none" stroke="${frameColor}" stroke-width="${sw}"/>`
    } else if (frameIndex === 3) {
      frameEl = `<rect x="15" y="15" width="${size - 30}" height="${size - 30}" rx="16" fill="none" stroke="${frameColor}" stroke-width="3"/>`
    } else if (frameIndex === 5) {
      frameEl = `<rect x="15" y="15" width="${size - 30}" height="${size - 30}" fill="none" stroke="${frameColor}" stroke-width="3" transform="rotate(45 ${cx} ${cy})"/>`
    }

    const letterEls = letters.split('').map((ch, i) => {
      const total = letters.length
      const spacing = total <= 1 ? 0 : (size - 80) / (total - 1)
      const x = total <= 1 ? cx : 40 + i * spacing
      const isMiddle = middleLarger && total === 3 && i === 1
      const fs = isMiddle ? fontSize * 1.4 : fontSize
      return `<text x="${x}" y="${cy + fs * 0.35}" font-family="${mainFont}, serif" font-size="${fs}" fill="${textColor}" text-anchor="middle">${ch}</text>`
    }).join('\n    ')

    // No background rect -- transparent SVG
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
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
    ? fonts.filter(f => f.family.toLowerCase().includes(fontSearch.toLowerCase()))
    : fonts

  const favoriteFonts = fonts.filter(f => favorites.includes(f.family))

  const FontButton = ({ f, isFav }: { f: LocalFont; isFav: boolean }) => (
    <div className="relative group">
      <button
        data-font-family={fontSource === 'google' ? f.family : undefined}
        onClick={() => handleFontChange(f.family)}
        className={`w-full text-left px-2.5 py-2 rounded-lg transition pr-8 ${
          mainFont === f.family
            ? 'bg-violet-600/20 border border-violet-600/40 text-violet-400'
            : 'bg-zinc-800 border border-zinc-700/50 text-zinc-400 hover:border-zinc-600'
        }`}
      >
        <span className="block text-sm leading-tight truncate" style={{ fontFamily: `"${f.family}", serif` }}>Abc</span>
        <span className="block text-[11px] opacity-60 truncate" style={{ fontFamily: 'Tahoma, Arial, sans-serif' }}>{f.family}</span>
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); toggleFavorite(f.family) }}
        className={`absolute top-1.5 right-1.5 p-0.5 rounded transition ${
          isFav
            ? 'text-amber-400 hover:text-amber-300'
            : 'text-zinc-600 opacity-0 group-hover:opacity-100 hover:text-zinc-400'
        }`}
        title={isFav ? 'Remove from favorites' : 'Add to favorites'}
      >
        <svg className="w-4 h-4" fill={isFav ? 'currentColor' : 'none'} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      </button>
    </div>
  )

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

        {/* Toast */}
        {toastMsg && (
          <div className="mx-6 mt-3 px-4 py-2 rounded-lg bg-amber-600/20 border border-amber-600/40 text-amber-300 text-sm text-center animate-pulse">
            {toastMsg}
          </div>
        )}

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
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  Font {favorites.length > 0 && <span className="text-amber-400 ml-1">({favorites.length} favorite{favorites.length !== 1 ? 's' : ''})</span>}
                </label>
                <input
                  type="text"
                  value={fontSearch}
                  onChange={e => setFontSearch(e.target.value)}
                  placeholder="Search fonts..."
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-violet-600 focus:outline-none mb-2"
                />
                <div ref={fontGridRef} className="max-h-56 overflow-y-auto space-y-2">
                  {/* Favorites section */}
                  {favoriteFonts.length > 0 && !fontSearch && (
                    <div>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                        </svg>
                        <span className="text-[11px] font-medium text-amber-400 uppercase tracking-wider">Favorites</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        {favoriteFonts.map(f => (
                          <FontButton key={`fav-${f.familyId}`} f={f} isFav={true} />
                        ))}
                      </div>
                      <div className="border-t border-zinc-700/50 mt-2 pt-1" />
                    </div>
                  )}
                  {/* All fonts */}
                  <div className="grid grid-cols-2 gap-1.5">
                    {filteredFonts.map(f => (
                      <FontButton key={f.familyId} f={f} isFav={favorites.includes(f.family)} />
                    ))}
                  </div>
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

              {/* Color Pickers */}
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2">Colors</label>
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex flex-col items-center gap-1.5">
                    <label className="text-[11px] text-zinc-500">Text / Font</label>
                    <div className="relative">
                      <input
                        type="color"
                        value={textColor}
                        onChange={e => setTextColor(e.target.value)}
                        className="w-10 h-10 rounded-lg border border-zinc-600 cursor-pointer bg-transparent [&::-webkit-color-swatch-wrapper]:p-0.5 [&::-webkit-color-swatch]:rounded-md [&::-webkit-color-swatch]:border-none"
                      />
                    </div>
                    <span className="text-[10px] text-zinc-600 font-mono">{textColor}</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <label className="text-[11px] text-zinc-500">Frame</label>
                    <div className="relative">
                      <input
                        type="color"
                        value={frameColor}
                        onChange={e => setFrameColor(e.target.value)}
                        className="w-10 h-10 rounded-lg border border-zinc-600 cursor-pointer bg-transparent [&::-webkit-color-swatch-wrapper]:p-0.5 [&::-webkit-color-swatch]:rounded-md [&::-webkit-color-swatch]:border-none"
                      />
                    </div>
                    <span className="text-[10px] text-zinc-600 font-mono">{frameColor}</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <label className="text-[11px] text-zinc-500">Preview BG</label>
                    <div className="relative">
                      <input
                        type="color"
                        value={previewBg}
                        onChange={e => setPreviewBg(e.target.value)}
                        className="w-10 h-10 rounded-lg border border-zinc-600 cursor-pointer bg-transparent [&::-webkit-color-swatch-wrapper]:p-0.5 [&::-webkit-color-swatch]:rounded-md [&::-webkit-color-swatch]:border-none"
                      />
                    </div>
                    <span className="text-[10px] text-zinc-600 font-mono">{previewBg}</span>
                  </div>
                </div>
                <p className="text-[10px] text-zinc-600 mt-1.5 text-center">Preview background is for display only and will not be exported</p>
              </div>
            </div>

            {/* Preview + Export */}
            <div className="space-y-4">
              {/* Preview wrapper with background (NOT captured) */}
              <div
                className="rounded-xl border border-zinc-700 flex items-center justify-center aspect-square"
                style={{ backgroundColor: previewBg }}
              >
                {/* Capture area -- transparent background for export */}
                <div
                  ref={canvasRef}
                  className="flex items-center justify-center w-full h-full"
                >
                  <div
                    className="flex items-center justify-center"
                    style={{
                      border: frame.border !== 'none' ? `${frame.border} ${frameColor}` : 'none',
                      borderRadius: frame.borderRadius || '0',
                      padding: frame.padding || '0',
                      transform: frame.transform || 'none',
                      width: frame.border !== 'none' ? '70%' : 'auto',
                      height: frame.border !== 'none' ? '70%' : 'auto',
                    }}
                  >
                    <div style={{ transform: frame.transform ? 'rotate(-45deg)' : 'none' }} className="flex items-baseline gap-1 justify-center">
                      {letters.split('').map((ch, i) => {
                        const isMiddle = middleLarger && letters.length === 3 && i === 1
                        return (
                          <span
                            key={i}
                            style={{
                              fontFamily: `"${mainFont}", serif`,
                              fontSize: `${isMiddle ? fontSize * 1.4 : fontSize}px`,
                              color: textColor,
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
              <p className="text-xs text-zinc-500 text-center">Exports have transparent backgrounds. SVG works with Cricut & Silhouette.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
