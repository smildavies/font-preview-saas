'use client'

import { useState, useEffect, useRef } from 'react'
import { type LocalFont } from '@/hooks/useLocalFonts'

interface FontMoodFinderProps {
  fonts: LocalFont[]
  onClose: () => void
  onSelectFont: (font: LocalFont) => void
  fontSource: 'local' | 'google'
  loadGoogleFont?: (family: string) => void
}

interface MoodCategory {
  name: string
  description: string
  emoji: string
  keywords: string[]
  color: string
  bgColor: string
}

const MOODS: MoodCategory[] = [
  {
    name: 'Elegant',
    description: 'Weddings, invitations, luxury brands',
    emoji: '✨',
    keywords: ['script', 'cursive', 'callig', 'didot', 'bodoni', 'playfair', 'cormorant', 'dancing', 'great vibes', 'allura', 'alex brush', 'parisienne', 'pinyon', 'tangerine', 'sacramento', 'italianno', 'lavishly', 'petit formal', 'satisfy', 'rouge', 'mrs saint', 'herr von'],
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10 border-amber-500/30',
  },
  {
    name: 'Farmhouse',
    description: 'Country, rustic, barn signs, kitchen decor',
    emoji: '🌾',
    keywords: ['slab', 'clarendon', 'rockwell', 'courier', 'american typewriter', 'josefin', 'amatic', 'homemade', 'indie flower', 'kalam', 'patrick hand', 'caveat', 'shadows into light', 'reenie beanie', 'gloria hallelujah', 'permanent marker', 'just another hand', 'nothing you could do', 'special elite'],
    color: 'text-amber-600',
    bgColor: 'bg-amber-600/10 border-amber-600/30',
  },
  {
    name: 'Modern',
    description: 'Clean, minimal, tech, business',
    emoji: '💎',
    keywords: ['helvetica', 'arial', 'futura', 'avenir', 'proxima', 'montserrat', 'poppins', 'inter', 'roboto', 'lato', 'open sans', 'nunito', 'raleway', 'work sans', 'dm sans', 'outfit', 'urbanist', 'sora', 'manrope', 'plus jakarta', 'general sans', 'satoshi', 'cabinet'],
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10 border-blue-500/30',
  },
  {
    name: 'Vintage',
    description: 'Retro, antique, old-world charm',
    emoji: '📜',
    keywords: ['garamond', 'caslon', 'baskerville', 'palatino', 'book antiqua', 'times', 'georgia', 'goudy', 'old standard', 'libre baskerville', 'cardo', 'lora', 'merriweather', 'crimson', 'spectral', 'dm serif', 'source serif', 'noto serif', 'playfair', 'eb garamond'],
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10 border-orange-500/30',
  },
  {
    name: 'Whimsical',
    description: 'Kids, fun, playful, party',
    emoji: '🎪',
    keywords: ['comic', 'marker', 'chalk', 'crayon', 'bubblegum', 'fredoka', 'bungee', 'bangers', 'luckiest guy', 'chewy', 'shrikhand', 'baloo', 'concert one', 'lemon', 'modak', 'rampart one', 'rubik', 'titan one', 'fascinate', 'boogaloo', 'cherry bomb', 'lilita one'],
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/10 border-pink-500/30',
  },
  {
    name: 'Handwritten',
    description: 'Personal, crafty, journaling, cards',
    emoji: '✍️',
    keywords: ['hand', 'brush', 'marker', 'sketch', 'doodle', 'write', 'drawn', 'ink', 'note', 'letter', 'journal', 'caveat', 'kalam', 'indie flower', 'patrick hand', 'architects daughter', 'mali', 'handlee', 'gochi hand', 'coming soon', 'cedarville', 'bad script', 'just me again', 'la belle aurore'],
    color: 'text-violet-400',
    bgColor: 'bg-violet-500/10 border-violet-500/30',
  },
  {
    name: 'Bold & Strong',
    description: 'Sports, gym, motivation, headlines',
    emoji: '💪',
    keywords: ['bold', 'black', 'heavy', 'ultra', 'impact', 'oswald', 'bebas', 'anton', 'teko', 'barlow condensed', 'big shoulders', 'russo one', 'righteous', 'passion one', 'fugaz one', 'saira condensed', 'pathway gothic', 'economica', 'fjalla one', 'archivo black'],
    color: 'text-red-400',
    bgColor: 'bg-red-500/10 border-red-500/30',
  },
  {
    name: 'Boho & Earthy',
    description: 'Natural, organic, wellness, yoga',
    emoji: '🌿',
    keywords: ['thin', 'light', 'josefin', 'quicksand', 'comfortaa', 'philosopher', 'poiret one', 'cormorant', 'forum', 'gfs didot', 'marcellus', 'cinzel', 'tenor sans', 'bellefair', 'sorts mill', 'caudex', 'fanwood', 'linden hill', 'neuton', 'tinos'],
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10 border-emerald-500/30',
  },
]

export default function FontMoodFinder({ fonts, onClose, onSelectFont, fontSource, loadGoogleFont }: FontMoodFinderProps) {
  const [selectedMood, setSelectedMood] = useState<number | null>(null)
  const [previewText, setPreviewText] = useState('The quick brown fox')
  const [fontSearch, setFontSearch] = useState('')
  const fontGridRef = useRef<HTMLDivElement>(null)

  const getMatchingFonts = (mood: MoodCategory): LocalFont[] => {
    return fonts.filter(f => {
      const name = f.family.toLowerCase()
      const style = (f.style || '').toLowerCase()
      return mood.keywords.some(kw => name.includes(kw) || style.includes(kw))
    })
  }

  const mood = selectedMood !== null ? MOODS[selectedMood] : null
  const allMatchingFonts = mood ? getMatchingFonts(mood) : []
  const matchingFonts = fontSearch
    ? allMatchingFonts.filter(f => f.family.toLowerCase().includes(fontSearch.toLowerCase()))
    : allMatchingFonts

  // Lazy-load Google Fonts as they appear in the results grid
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
  }, [fontSource, loadGoogleFont, matchingFonts])

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-fuchsia-500 to-cyan-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Font Mood Finder</h2>
              <p className="text-xs text-zinc-500">Find fonts by style — perfect for crafting projects</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white transition rounded-lg hover:bg-zinc-800">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Mood Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {MOODS.map((m, i) => (
              <button
                key={m.name}
                onClick={() => setSelectedMood(selectedMood === i ? null : i)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                  selectedMood === i
                    ? `${m.bgColor} ring-1 ring-current ${m.color}`
                    : 'bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-800 text-zinc-400'
                }`}
              >
                <span className="text-2xl">{m.emoji}</span>
                <span className="text-sm font-semibold">{m.name}</span>
                <span className="text-[10px] text-center opacity-70">{m.description}</span>
              </button>
            ))}
          </div>

          {/* Results */}
          {mood && (
            <>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h3 className={`text-lg font-bold ${mood.color}`}>
                    {mood.emoji} {mood.name} Fonts
                  </h3>
                  <p className="text-xs text-zinc-500">
                    {matchingFonts.length} font{matchingFonts.length !== 1 ? 's' : ''} found from your collection
                  </p>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={fontSearch}
                    onChange={e => setFontSearch(e.target.value)}
                    placeholder="Search fonts..."
                    className="w-48 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-violet-600 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={previewText}
                    onChange={e => setPreviewText(e.target.value)}
                    placeholder="Preview text..."
                    className="w-48 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-violet-600 focus:outline-none"
                  />
                </div>
              </div>

              {matchingFonts.length === 0 ? (
                <div className="text-center py-12 text-zinc-500">
                  <p className="text-sm">No {mood.name.toLowerCase()} fonts found in your current collection.</p>
                  <p className="text-xs mt-1">Try switching to Google Fonts for more options.</p>
                </div>
              ) : (
                <div ref={fontGridRef} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {matchingFonts.map(font => (
                    <button
                      key={font.familyId}
                      data-font-family={fontSource === 'google' ? font.family : undefined}
                      onClick={() => {
                        if (fontSource === 'google' && loadGoogleFont) loadGoogleFont(font.family)
                        onSelectFont(font)
                        onClose()
                      }}
                      className="text-left rounded-xl border border-zinc-800 bg-zinc-900 p-4 hover:border-violet-600/50 transition-all group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-violet-400" style={{ fontFamily: `"${font.family}", sans-serif` }}>{font.family}</span>
                        <span className="text-[10px] text-zinc-600 group-hover:text-zinc-400 transition">Click to use</span>
                      </div>
                      <p
                        className="text-xl text-white truncate"
                        style={{ fontFamily: `"${font.family}", sans-serif` }}
                      >
                        {previewText}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
