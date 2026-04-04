'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useUser } from '@/hooks/useUser'
import { useLocalFonts, type LocalFont } from '@/hooks/useLocalFonts'
import { useGoogleFonts } from '@/hooks/useGoogleFonts'
import { useRecentFonts } from '@/hooks/useRecentFonts'
import { classifyFont, CLASS_LABELS, type FontClass } from '@/lib/fontClassify'
import Controls from '@/components/Controls'
import GlyphModal from '@/components/GlyphModal'
import MockupModal from '@/components/MockupModal'
import PairingModal from '@/components/PairingModal'
import SimilarFontsPanel from '@/components/SimilarFontsPanel'
import ShareModal from '@/components/ShareModal'
import BrowserBanner from '@/components/BrowserBanner'
import FontMixer from '@/components/FontMixer'
import MonogramBuilder from '@/components/MonogramBuilder'
import FontMoodFinder from '@/components/FontMoodFinder'
import WeddingTemplates from '@/components/WeddingTemplates'
import VariableAxesEditor from '@/components/VariableAxesEditor'
import KeyboardShortcuts from '@/components/KeyboardShortcuts'
import ThemeToggle from '@/components/ThemeToggle'
import ContrastChecker from '@/components/ContrastChecker'
import CSSGenerator from '@/components/CSSGenerator'
import FontCollections from '@/components/FontCollections'
import RecentFontsRow from '@/components/RecentFontsRow'

export default function DashboardPage() {
  const { isPro } = useUser()
  const { fonts: localFonts, loading: localLoading, method, totalCount: localTotal, refresh: refreshLocalFonts, apiAttempted } = useLocalFonts()
  const { fonts: googleFontsList, loading: googleLoading, loadFont: loadGoogleFont, totalCount: googleTotal } = useGoogleFonts()

  // Font source tab — default to Google Fonts on browsers without local font access (Safari, Firefox, iPad)
  const [fontSource, setFontSource] = useState<'local' | 'google'>('local')

  useEffect(() => {
    if (!('queryLocalFonts' in window)) {
      setFontSource('google')
    }
  }, [])

  // Convert Google fonts to LocalFont shape for unified rendering
  const googleFontsAsLocal: LocalFont[] = googleFontsList.map((gf, i) => ({
    family: gf.family,
    fullName: gf.family,
    postscriptName: gf.family.replace(/\s/g, '-'),
    style: gf.category,
    familyId: `google-${i}`,
  }))

  // Uploaded custom fonts (loaded via drag-drop or file picker)
  const [uploadedFonts, setUploadedFonts] = useState<LocalFont[]>([])
  const [uploadingCount, setUploadingCount] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFontFiles = useCallback(async (files: FileList | File[]) => {
    const fontFiles = Array.from(files).filter(f =>
      /\.(ttf|otf|woff|woff2)$/i.test(f.name)
    )
    if (fontFiles.length === 0) return

    setUploadingCount(fontFiles.length)
    const newFonts: LocalFont[] = []

    for (const file of fontFiles) {
      try {
        const arrayBuffer = await file.arrayBuffer()
        const fontName = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ')
        const fontId = `uploaded-${fontName}-${Date.now()}`

        // Check if already loaded
        const alreadyExists = uploadedFonts.some(f => f.family === fontName) ||
                              localFonts.some(f => f.family === fontName)
        if (alreadyExists) continue

        // Register the font face in the browser
        const face = new FontFace(fontName, arrayBuffer)
        const loaded = await face.load()
        document.fonts.add(loaded)

        newFonts.push({
          family: fontName,
          fullName: fontName,
          postscriptName: fontName.replace(/\s/g, '-'),
          style: 'Regular',
          familyId: fontId,
        })
      } catch {
        // Skip broken font files silently
      }
    }

    if (newFonts.length > 0) {
      setUploadedFonts(prev => [...prev, ...newFonts])
      setToast(`Loaded ${newFonts.length} font${newFonts.length > 1 ? 's' : ''}`)
      setTimeout(() => setToast(''), 2000)
    }
    setUploadingCount(0)
  }, [uploadedFonts, localFonts])

  // Merge local/uploaded fonts when on local tab
  const combinedLocalFonts = [...localFonts, ...uploadedFonts]
    .sort((a, b) => a.family.localeCompare(b.family))

  const allFonts = fontSource === 'local' ? combinedLocalFonts : googleFontsAsLocal
  const loading = fontSource === 'local' ? localLoading : googleLoading
  const totalCount = fontSource === 'local' ? combinedLocalFonts.length : googleTotal

  // Preview settings
  const [text, setText] = useState('Hello World')
  const [fontSize, setFontSize] = useState(64)
  const [letterSpacing, setLetterSpacing] = useState(0)
  const [lineHeight, setLineHeight] = useState(1.3)
  const [textColor, setTextColor] = useState('#e8e8e8')
  const [bgColor, setBgColor] = useState('#0f0f0f')
  const [search, setSearch] = useState('')
  const [bold, setBold] = useState(false)
  const [italic, setItalic] = useState(false)
  const [uppercase, setUppercase] = useState(false)
  const [underline, setUnderline] = useState(false)
  const [textAlign, setTextAlign] = useState('center')

  // Modals
  const [glyphFont, setGlyphFont] = useState<LocalFont | null>(null)
  const [mockupFont, setMockupFont] = useState<LocalFont | null>(null)
  const [pairingFont, setPairingFont] = useState<LocalFont | null>(null)
  const [similarFont, setSimilarFont] = useState<LocalFont | null>(null)
  const [showShare, setShowShare] = useState(false)
  const [showFontMixer, setShowFontMixer] = useState(false)
  const [showMonogram, setShowMonogram] = useState(false)
  const [showMoodFinder, setShowMoodFinder] = useState(false)
  const [weddingFont, setWeddingFont] = useState<LocalFont | null>(null)
  const [cssGenFont, setCssGenFont] = useState<string | null>(null)
  const [showCollections, setShowCollections] = useState(false)
  const [variableFont, setVariableFont] = useState<LocalFont | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Category filter
  const [fontCategory, setFontCategory] = useState<string>('all')

  // Favorites
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('font-preview-favorites')
      return saved ? new Set(JSON.parse(saved)) : new Set()
    }
    return new Set()
  })

  const toggleFavorite = useCallback((fontFamily: string) => {
    setFavorites(prev => {
      const next = new Set(prev)
      if (next.has(fontFamily)) next.delete(fontFamily)
      else next.add(fontFamily)
      localStorage.setItem('font-preview-favorites', JSON.stringify([...next]))
      return next
    })
  }, [])

  // Recent fonts
  const { recentNames, addRecent } = useRecentFonts()

  // Compare
  const [compareList, setCompareList] = useState<LocalFont[]>([])

  // View mode
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')

  // Sort
  const [sortBy, setSortBy] = useState<'az' | 'za' | 'popular'>('az')

  // Scroll to top
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Toast
  const [toast, setToast] = useState('')

  const filteredFonts = allFonts.filter(f => {
    if (search) {
      if (search.includes('|')) {
        const terms = search.split('|').map(s => s.trim().toLowerCase()).filter(Boolean)
        if (!terms.some(term => f.family.toLowerCase().includes(term))) return false
      } else if (!f.family.toLowerCase().includes(search.toLowerCase())) {
        return false
      }
    }
    if (fontCategory === 'favorites') return favorites.has(f.family)
    if (fontCategory !== 'all') return classifyFont(f.family) === fontCategory
    return true
  }).sort((a, b) => {
    if (sortBy === 'za') return b.family.localeCompare(a.family)
    if (sortBy === 'popular') return 0 // keep original order (Google Fonts = by popularity)
    return a.family.localeCompare(b.family) // 'az'
  })

  const handleCompare = (font: LocalFont) => {
    if (compareList.find(c => c.familyId === font.familyId)) return
    setCompareList(prev => {
      const next = [...prev, font]
      if (next.length > 6) next.shift()
      return next
    })
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setToast(`Copied: ${label}`)
      setTimeout(() => setToast(''), 2000)
    })
  }

  const handleExportPNG = (font: LocalFont) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    canvas.width = 1200
    canvas.height = 400
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#a78bfa'
    ctx.font = '20px -apple-system, sans-serif'
    ctx.fillText(font.family, 40, 40)
    ctx.fillStyle = textColor
    const fontSpec = `${italic ? 'italic ' : ''}${bold ? 'bold ' : ''}${fontSize}px "${font.family}", sans-serif`
    ctx.font = fontSpec
    const previewStr = uppercase ? (text || 'Hello World').toUpperCase() : (text || 'Hello World')
    const words = previewStr.split(' ')
    let line = ''
    let y = 120
    const lh = lineHeight * fontSize
    for (const word of words) {
      const test = line + word + ' '
      if (ctx.measureText(test).width > 1120 && line) {
        ctx.fillText(line.trim(), 40, y)
        line = word + ' '
        y += lh
      } else {
        line = test
      }
    }
    ctx.fillText(line.trim(), 40, y)
    const link = document.createElement('a')
    link.download = `${font.family.replace(/[^a-zA-Z0-9]/g, '_')}_preview.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
    setToast(`Exported ${font.family}`)
    setTimeout(() => setToast(''), 2000)
  }

  const addToCollection = useCallback((fontFamily: string) => {
    const saved = localStorage.getItem('fontCollections')
    const collections = saved ? JSON.parse(saved) : []
    if (collections.length === 0) {
      setShowCollections(true)
      return
    }
    // Add to the first collection if exists
    const updated = collections.map((c: { id: string; fonts: string[] }, i: number) => {
      if (i === 0 && !c.fonts.includes(fontFamily)) {
        return { ...c, fonts: [...c.fonts, fontFamily] }
      }
      return c
    })
    localStorage.setItem('fontCollections', JSON.stringify(updated))
    setToast(`Added ${fontFamily} to "${collections[0].name}"`)
    setTimeout(() => setToast(''), 2000)
  }, [])

  const previewText = uppercase ? (text || 'Hello World').toUpperCase() : (text || 'Hello World')

  // Load Google fonts as they scroll into view
  useEffect(() => {
    if (fontSource !== 'google') return
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const family = entry.target.getAttribute('data-font-family')
          if (family) loadGoogleFont(family)
          observer.unobserve(entry.target)
        }
      })
    }, { rootMargin: '200px' })

    document.querySelectorAll('[data-font-family]').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [fontSource, filteredFonts, loadGoogleFont])

  return (
    <div className="min-h-screen">
      {/* Browser Banner */}
      <BrowserBanner />

      {/* Font Source Tabs */}
      <div className="border-b border-zinc-800 bg-zinc-950">
        <div className="flex items-center justify-between px-6">
          <div className="flex items-center gap-0">
            <button
              onClick={() => {
                setFontSource('local')
                // Request full Font Book access on user click (requires user gesture)
                if (method === 'canvas' && 'queryLocalFonts' in window) {
                  refreshLocalFonts()
                }
              }}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition ${
                fontSource === 'local'
                  ? 'border-violet-500 text-violet-400'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              My Fonts
              <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full bg-zinc-800 text-zinc-400">
                {localTotal}
              </span>
            </button>
            {fontSource === 'local' && (
              <>
              <button
                onClick={() => refreshLocalFonts()}
                className="ml-1 px-2 py-1.5 text-xs text-zinc-500 hover:text-violet-400 transition"
                title="Rescan installed fonts"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                </svg>
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="ml-1 px-3 py-1.5 text-xs font-medium text-violet-400 hover:text-violet-300 border border-violet-600/30 rounded-lg hover:bg-violet-600/10 transition flex items-center gap-1.5"
                title="Upload .ttf, .otf, .woff font files"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                Upload Fonts
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".ttf,.otf,.woff,.woff2"
                multiple
                className="hidden"
                onChange={(e) => e.target.files && handleFontFiles(e.target.files)}
              />
              </>
            )}
            <button
              onClick={() => setFontSource('google')}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition ${
                fontSource === 'google'
                  ? 'border-violet-500 text-violet-400'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Google Fonts
              <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full bg-zinc-800 text-zinc-400">
                {googleTotal || '1,500+'}
              </span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setShowCollections(true)}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition flex items-center gap-1.5"
            >
              Collections
            </button>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="px-4 sm:px-6">
      <Controls
        text={text} setText={setText}
        fontSize={fontSize} setFontSize={setFontSize}
        letterSpacing={letterSpacing} setLetterSpacing={setLetterSpacing}
        lineHeight={lineHeight} setLineHeight={setLineHeight}
        textColor={textColor} setTextColor={setTextColor}
        bgColor={bgColor} setBgColor={setBgColor}
        search={search} setSearch={setSearch}
        bold={bold} setBold={setBold}
        italic={italic} setItalic={setItalic}
        uppercase={uppercase} setUppercase={setUppercase}
        underline={underline} setUnderline={setUnderline}
        textAlign={textAlign} setTextAlign={setTextAlign}
        isPro={isPro}
        searchInputRef={searchInputRef}
      />
      </div>

      {/* Contrast Checker */}
      <div className="px-6 py-2">
        <ContrastChecker textColor={textColor} bgColor={bgColor} />
      </div>

      {/* Category Filter Bar */}
      <div className="px-6 py-2">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFontCategory('all')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-full border transition ${
              fontCategory === 'all'
                ? 'bg-violet-600 border-violet-500 text-white'
                : 'border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500'
            }`}
          >
            All
          </button>
          {(Object.entries(CLASS_LABELS) as [FontClass, string][]).map(([cls, label]) => (
            <button
              key={cls}
              onClick={() => setFontCategory(cls)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-full border transition ${
                fontCategory === cls
                  ? 'bg-violet-600 border-violet-500 text-white'
                  : 'border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500'
              }`}
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => setFontCategory('favorites')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-full border transition flex items-center gap-1 ${
              fontCategory === 'favorites'
                ? 'bg-amber-600 border-amber-500 text-white'
                : 'border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500'
            }`}
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            Favorites ({favorites.size})
          </button>
        </div>
      </div>

      {/* Recent Fonts */}
      <div className="px-6">
        <RecentFontsRow recentNames={recentNames} onSelect={(name) => setSearch(name)} />
      </div>

      {/* Font Grid */}
      <div
        className="p-6"
        onDragOver={(e) => { e.preventDefault(); e.stopPropagation() }}
        onDrop={(e) => {
          e.preventDefault()
          e.stopPropagation()
          if (e.dataTransfer.files.length > 0) {
            handleFontFiles(e.dataTransfer.files)
            setFontSource('local')
          }
        }}
      >
        {uploadingCount > 0 && (
          <div className="mb-4 p-3 rounded-xl border border-violet-600/30 bg-violet-600/5 flex items-center gap-3">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-700 border-t-violet-500" />
            <p className="text-sm text-zinc-300">Loading {uploadingCount} font file{uploadingCount > 1 ? 's' : ''}...</p>
          </div>
        )}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-zinc-700 border-t-violet-500" />
            <p className="text-zinc-400 text-sm">Detecting your installed fonts...</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-zinc-500">
                {search ? `${filteredFonts.length} / ` : ''}{totalCount} fonts detected
                <span className="ml-2 text-xs text-zinc-600">
                  via {method === 'api' ? 'Local Font Access API' : 'canvas detection'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => isPro ? setShowShare(true) : (window.location.href = '/pricing')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition flex items-center gap-1.5 ${
                    isPro
                      ? 'border-violet-600 text-violet-400 hover:bg-violet-600/10'
                      : 'border-zinc-700 text-zinc-500'
                  }`}
                >
                  {!isPro && <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>}
                  Share with Client
                </button>
                <button
                  onClick={() => isPro ? setShowFontMixer(true) : (window.location.href = '/pricing')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition flex items-center gap-1.5 ${
                    isPro
                      ? 'border-pink-600/50 text-pink-400 hover:bg-pink-600/10'
                      : 'border-zinc-700 text-zinc-500'
                  }`}
                >
                  {!isPro && <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>}
                  Font Mixer
                </button>
                <button
                  onClick={() => isPro ? setShowMonogram(true) : (window.location.href = '/pricing')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition flex items-center gap-1.5 ${
                    isPro
                      ? 'border-amber-600/50 text-amber-400 hover:bg-amber-600/10'
                      : 'border-zinc-700 text-zinc-500'
                  }`}
                >
                  {!isPro && <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>}
                  Monogram
                </button>
                <button
                  onClick={() => isPro ? setShowMoodFinder(true) : (window.location.href = '/pricing')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition flex items-center gap-1.5 ${
                    isPro
                      ? 'border-fuchsia-600/50 text-fuchsia-400 hover:bg-fuchsia-600/10'
                      : 'border-zinc-700 text-zinc-500'
                  }`}
                >
                  {!isPro && <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>}
                  Font Moods
                </button>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'az' | 'za' | 'popular')}
                className="px-2 py-1.5 text-xs font-medium rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-500 transition cursor-pointer focus:outline-none focus:border-violet-500"
              >
                <option value="az">A → Z</option>
                <option value="za">Z → A</option>
                <option value="popular">Default Order</option>
              </select>
              <div className="flex gap-1 bg-zinc-900 rounded-lg p-1">
                {(['list', 'grid'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition capitalize ${
                      viewMode === mode
                        ? 'bg-violet-600 text-white'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
              </div>
            </div>

            {filteredFonts.length === 0 ? (
              <div className="text-center py-20">
                {fontSource === 'local' && method === 'canvas' && 'queryLocalFonts' in window ? (
                  <div className="max-w-md mx-auto space-y-4">
                    <svg className="w-12 h-12 mx-auto text-violet-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" />
                    </svg>
                    <p className="text-zinc-300 font-medium">See all your Font Book fonts</p>
                    <p className="text-zinc-500 text-sm">
                      {apiAttempted
                        ? 'Font access was denied. Click the lock/tune icon in the address bar → "Site settings" → change "Fonts" to "Allow" → then refresh this page.'
                        : 'Click below to grant Chrome access to read all your installed fonts from Font Book. You\'ll see a permission popup — click "Allow".'}
                    </p>
                    {!apiAttempted && (
                      <button
                        onClick={() => refreshLocalFonts()}
                        className="px-5 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition"
                      >
                        Load All Font Book Fonts
                      </button>
                    )}
                  </div>
                ) : fontSource === 'local' && totalCount === 0 ? (
                  <div className="max-w-md mx-auto space-y-4">
                    <p className="text-zinc-400 font-medium">No local fonts detected</p>
                    <p className="text-zinc-500 text-sm">
                      Your browser doesn&apos;t support local font access. Use the Google Fonts tab, or switch to Chrome/Edge to access your Font Book fonts.
                    </p>
                  </div>
                ) : (
                  <p className="text-zinc-500">No fonts match &quot;{search}&quot;</p>
                )}
              </div>
            ) : (
              <>
              {/* Banner: prompt to unlock full Font Book access when on canvas fallback */}
              {fontSource === 'local' && method === 'canvas' && 'queryLocalFonts' in window && (
                <div className="mb-4 p-3 rounded-xl border border-violet-600/30 bg-violet-600/5 flex items-center justify-between gap-3">
                  <p className="text-sm text-zinc-300">
                    Showing {totalCount} common fonts. <span className="text-violet-400 font-medium">Grant access to see all your Font Book fonts.</span>
                  </p>
                  <button
                    onClick={() => refreshLocalFonts()}
                    className="shrink-0 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs font-medium transition"
                  >
                    Load All Fonts
                  </button>
                </div>
              )}
              <div className={`grid gap-3 ${
                viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2' :
                'grid-cols-1'
              }`}>
                {filteredFonts.map((font, fontIndex) => {
                  const FREE_PREVIEW_LIMIT = 20
                  const isLocked = !isPro && fontIndex >= FREE_PREVIEW_LIMIT

                  return (
                  <div
                    key={font.familyId}
                    data-font-family={fontSource === 'google' ? font.family : undefined}
                    className="group rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden hover:border-violet-600/50 transition-all"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between px-3 py-2 bg-zinc-900/80 border-b border-zinc-800" style={{ fontFamily: 'Tahoma, Geneva, sans-serif' }}>
                      <div className="flex items-center gap-2 min-w-0">
                        {/* Favorite Star */}
                        <button
                          onClick={() => toggleFavorite(font.family)}
                          className={`shrink-0 transition ${favorites.has(font.family) ? 'text-amber-400' : 'text-zinc-700 hover:text-amber-400/60'}`}
                          title={favorites.has(font.family) ? 'Remove from favorites' : 'Add to favorites'}
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                        </button>
                        <button
                          onClick={() => { addRecent(font.family); copyToClipboard(font.family, font.family) }}
                          className="truncate text-sm font-semibold text-violet-400 hover:text-violet-300 transition"
                          title="Click to copy font name"
                        >
                          {font.family}
                          <span className="ml-2 text-xs text-zinc-600 opacity-0 group-hover:opacity-100 transition">
                            click to copy
                          </span>
                        </button>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] shrink-0">
                        {/* Category badge */}
                        <span className="px-1.5 py-0.5 rounded bg-violet-900/30 text-violet-400 font-medium">
                          {CLASS_LABELS[classifyFont(font.family) as FontClass] || font.style}
                        </span>
                        {/* Info tooltip */}
                        <span className="relative group/info cursor-help text-zinc-600 hover:text-zinc-400">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><path d="M12 16v-4m0-4h.01"/></svg>
                          <span className="absolute right-0 top-full mt-1 z-50 hidden group-hover/info:block w-48 p-2 rounded-lg bg-zinc-800 border border-zinc-700 text-xs text-zinc-300 shadow-xl">
                            <div className="font-medium text-violet-400 mb-1">{font.family}</div>
                            <div>Style: {classifyFont(font.family)}</div>
                            <div>Source: {fontSource === 'google' ? 'Google Fonts' : 'Local'}</div>
                            {font.style && <div>Category: {font.style}</div>}
                          </span>
                        </span>
                        {isLocked && (
                          <span className="text-violet-400 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>
                            Pro
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Preview */}
                    {isLocked ? (
                      <div className="relative px-4 py-5 min-h-[90px]" style={{ background: bgColor }}>
                        <div className="blur-md select-none pointer-events-none" style={{
                          fontFamily: `"${font.family}", sans-serif`,
                          fontSize: `${fontSize}px`,
                          color: textColor,
                        }}>
                          {previewText}
                        </div>
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/60">
                          <svg className="w-5 h-5 text-violet-400 mb-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>
                          <a href="/pricing" className="text-xs text-violet-400 hover:text-violet-300 font-medium">
                            Upgrade to Pro to preview all fonts
                          </a>
                        </div>
                      </div>
                    ) : (
                    <div
                      className={`px-4 min-h-[90px] max-h-[200px] overflow-hidden flex items-center justify-center ${
                        'py-5'
                      }`}
                      style={{
                        fontFamily: `"${font.family}", sans-serif`,
                        fontSize: `${fontSize}px`,
                        letterSpacing: `${letterSpacing}px`,
                        lineHeight: lineHeight,
                        color: textColor,
                        background: bgColor,
                        fontWeight: bold ? 'bold' : 'normal',
                        fontStyle: italic ? 'italic' : 'normal',
                        textDecoration: underline ? 'underline' : 'none',
                        textAlign: textAlign as 'left' | 'center' | 'right',
                      }}
                    >
                      {previewText}
                    </div>
                    )}

                    {/* Actions — compact buttons with flex-wrap to match desktop */}
                    <div className="flex flex-wrap gap-1 px-3 py-1.5 border-t border-zinc-800 justify-end" style={{ fontFamily: 'Tahoma, Geneva, sans-serif' }}>
                      <button
                        onClick={() => setCssGenFont(font.family)}
                        className="px-2 py-0.5 text-[10px] border border-zinc-700 rounded text-zinc-400 hover:text-white hover:border-zinc-500 transition whitespace-nowrap"
                      >
                        Copy CSS
                      </button>
                      <button
                        onClick={() => addToCollection(font.family)}
                        className="px-2 py-0.5 text-[10px] border border-zinc-700 rounded text-zinc-400 hover:text-white hover:border-zinc-500 transition whitespace-nowrap"
                        title="Add to collection"
                      >
                        + Collection
                      </button>
                      <button
                        onClick={() => isPro ? setGlyphFont(font) : (window.location.href = '/pricing')}
                        className={`px-2 py-0.5 text-[10px] border rounded transition flex items-center gap-0.5 whitespace-nowrap ${
                          isPro
                            ? 'border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500'
                            : 'border-zinc-700/50 text-zinc-600 hover:border-violet-700/50 hover:text-violet-400'
                        }`}
                      >
                        {!isPro && <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>}
                        Glyphs
                      </button>
                      <button
                        onClick={() => isPro ? handleCompare(font) : (window.location.href = '/pricing')}
                        className={`px-2 py-0.5 text-[10px] border rounded transition flex items-center gap-0.5 whitespace-nowrap ${
                          isPro
                            ? 'border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500'
                            : 'border-zinc-700/50 text-zinc-600 hover:border-violet-700/50 hover:text-violet-400'
                        }`}
                      >
                        {!isPro && <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>}
                        Compare
                      </button>
                      <button
                        onClick={() => isPro ? handleExportPNG(font) : (window.location.href = '/pricing')}
                        className={`px-2 py-0.5 text-[10px] border rounded transition flex items-center gap-0.5 whitespace-nowrap ${
                          isPro
                            ? 'border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500'
                            : 'border-zinc-700/50 text-zinc-600 hover:border-violet-700/50 hover:text-violet-400'
                        }`}
                      >
                        {!isPro && <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>}
                        Export PNG
                      </button>
                      <button
                        onClick={() => isPro ? setMockupFont(font) : (window.location.href = '/pricing')}
                        className={`px-2 py-0.5 text-[10px] border rounded transition flex items-center gap-0.5 whitespace-nowrap ${
                          isPro
                            ? 'border-violet-700/50 text-violet-400 hover:bg-violet-600/10'
                            : 'border-zinc-700/50 text-zinc-600 hover:border-violet-700/50 hover:text-violet-400'
                        }`}
                      >
                        {!isPro && <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>}
                        Mockups
                      </button>
                      <button
                        onClick={() => isPro ? setPairingFont(font) : (window.location.href = '/pricing')}
                        className={`px-2 py-0.5 text-[10px] border rounded transition flex items-center gap-0.5 whitespace-nowrap ${
                          isPro
                            ? 'border-violet-700/50 text-violet-400 hover:bg-violet-600/10'
                            : 'border-zinc-700/50 text-zinc-600 hover:border-violet-700/50 hover:text-violet-400'
                        }`}
                      >
                        {!isPro && <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>}
                        Pairings
                      </button>
                      <button
                        onClick={() => isPro ? setSimilarFont(font) : (window.location.href = '/pricing')}
                        className={`px-2 py-0.5 text-[10px] border rounded transition flex items-center gap-0.5 whitespace-nowrap ${
                          isPro
                            ? 'border-violet-700/50 text-violet-400 hover:bg-violet-600/10'
                            : 'border-zinc-700/50 text-zinc-600 hover:border-violet-700/50 hover:text-violet-400'
                        }`}
                      >
                        {!isPro && <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>}
                        Similar
                      </button>
                      <button
                        onClick={() => isPro ? setWeddingFont(font) : (window.location.href = '/pricing')}
                        className={`px-2 py-0.5 text-[10px] border rounded transition flex items-center gap-0.5 whitespace-nowrap ${
                          isPro
                            ? 'border-rose-700/50 text-rose-400 hover:bg-rose-600/10'
                            : 'border-zinc-700/50 text-zinc-600 hover:border-rose-700/50 hover:text-rose-400'
                        }`}
                      >
                        {!isPro && <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>}
                        Invitations
                      </button>
                      <button
                        onClick={() => isPro ? setVariableFont(font) : (window.location.href = '/pricing')}
                        className={`px-2 py-0.5 text-[10px] border rounded transition flex items-center gap-0.5 whitespace-nowrap ${
                          isPro
                            ? 'border-cyan-700/50 text-cyan-400 hover:bg-cyan-600/10'
                            : 'border-zinc-700/50 text-zinc-600 hover:border-cyan-700/50 hover:text-cyan-400'
                        }`}
                      >
                        {!isPro && <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>}
                        Variable
                      </button>
                    </div>
                  </div>
                  )
                })}
              </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Compare Panel */}
      {compareList.length > 0 && isPro && (
        <div className="fixed bottom-0 left-0 right-0 z-[100] border-t-2 border-violet-600 bg-zinc-950 p-5 shadow-[0_-8px_30px_rgba(0,0,0,0.5)] max-h-[40vh] overflow-y-auto">
          <h3 className="text-sm font-semibold text-zinc-300 mb-3">
            Compare ({compareList.length})
          </h3>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {compareList.map(font => {
              if (fontSource === 'google') loadGoogleFont(font.family)
              return (
              <div key={font.familyId} className="flex-shrink-0 min-w-[250px] border border-zinc-800 rounded-lg p-3 relative" style={{ backgroundColor: bgColor }}>
                <button
                  onClick={() => setCompareList(prev => prev.filter(f => f.familyId !== font.familyId))}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-pink-500/20 text-pink-400 text-xs flex items-center justify-center hover:bg-pink-500/40"
                >
                  &times;
                </button>
                <div className="text-xs text-violet-400 mb-1">{font.family}</div>
                <div style={{
                  fontFamily: `"${font.family}", sans-serif`,
                  fontSize: `${fontSize}px`,
                  letterSpacing: `${letterSpacing}px`,
                  lineHeight: lineHeight,
                  color: textColor,
                  fontWeight: bold ? 'bold' : 'normal',
                  fontStyle: italic ? 'italic' : 'normal',
                  textDecoration: underline ? 'underline' : 'none',
                }}>
                  {previewText}
                </div>
              </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Glyph Modal */}
      {glyphFont && isPro && (
        <GlyphModal
          isOpen={!!glyphFont}
          onClose={() => setGlyphFont(null)}
          fontName={glyphFont.family}
          fontFamilyId={glyphFont.family}
        />
      )}

      {/* Mockup Modal */}
      {mockupFont && isPro && (
        <MockupModal
          isOpen={!!mockupFont}
          onClose={() => setMockupFont(null)}
          fontFamily={mockupFont.family}
          fontName={mockupFont.family}
        />
      )}

      {/* Pairing Modal */}
      {pairingFont && isPro && (
        <PairingModal
          isOpen={!!pairingFont}
          onClose={() => setPairingFont(null)}
          fontFamily={pairingFont.family}
          fontName={pairingFont.family}
          allFonts={allFonts.map(f => f.family)}
          loadGoogleFont={fontSource === 'google' ? loadGoogleFont : undefined}
        />
      )}

      {/* Similar Fonts Panel */}
      {similarFont && isPro && (
        <SimilarFontsPanel
          isOpen={!!similarFont}
          onClose={() => setSimilarFont(null)}
          fontFamily={similarFont.family}
          fontName={similarFont.family}
          allFonts={allFonts.map(f => f.family)}
          loadGoogleFont={fontSource === 'google' ? loadGoogleFont : undefined}
        />
      )}

      {/* Share Modal */}
      {showShare && isPro && (
        <ShareModal
          isOpen={showShare}
          onClose={() => setShowShare(false)}
          allFonts={allFonts.map(f => f.family)}
        />
      )}

      {/* Font Mixer */}
      {showFontMixer && isPro && (
        <FontMixer
          fonts={allFonts}
          onClose={() => setShowFontMixer(false)}
          isPro={isPro}
          fontSource={fontSource}
          loadGoogleFont={fontSource === 'google' ? loadGoogleFont : undefined}
        />
      )}

      {/* Monogram Builder */}
      {showMonogram && isPro && (
        <MonogramBuilder
          fonts={allFonts}
          onClose={() => setShowMonogram(false)}
          fontSource={fontSource}
          loadGoogleFont={fontSource === 'google' ? loadGoogleFont : undefined}
        />
      )}

      {/* Font Mood Finder */}
      {showMoodFinder && isPro && (
        <FontMoodFinder
          fonts={allFonts}
          onClose={() => setShowMoodFinder(false)}
          onSelectFont={(font) => setSearch(font.family)}
          fontSource={fontSource}
          loadGoogleFont={fontSource === 'google' ? loadGoogleFont : undefined}
        />
      )}

      {/* Wedding Templates */}
      {weddingFont && isPro && (
        <WeddingTemplates
          fontFamily={weddingFont.family}
          allFonts={allFonts}
          googleFonts={googleFontsAsLocal}
          loadGoogleFont={loadGoogleFont}
          onClose={() => setWeddingFont(null)}
        />
      )}

      {/* Variable Axes Editor */}
      {variableFont && isPro && (
        <VariableAxesEditor
          fontFamily={variableFont.family}
          onClose={() => setVariableFont(null)}
        />
      )}

      {/* CSS Generator Modal */}
      {cssGenFont && <CSSGenerator fontFamily={cssGenFont} onClose={() => setCssGenFont(null)} />}

      {/* Font Collections Modal */}
      {showCollections && (
        <FontCollections
          onClose={() => setShowCollections(false)}
          onSelectCollection={(fonts) => {
            setShowCollections(false)
            setSearch(fonts.join('|'))
          }}
        />
      )}

      {/* Keyboard Shortcuts */}
      <KeyboardShortcuts
        onSearch={() => searchInputRef.current?.focus()}
        onViewChange={(v) => setViewMode(v as 'list' | 'grid')}
        onOpenMixer={() => setShowFontMixer(true)}
        onOpenMonogram={() => setShowMonogram(true)}
        onOpenPairing={() => { if (filteredFonts[0]) setPairingFont(filteredFonts[0]) }}
      />

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-violet-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium shadow-lg z-[999] animate-pulse">
          {toast}
        </div>
      )}

      {/* Scroll to Top */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-[100] w-10 h-10 rounded-full bg-violet-600 hover:bg-violet-700 text-white shadow-lg flex items-center justify-center transition-all"
          title="Back to top"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
          </svg>
        </button>
      )}
    </div>
  )
}
