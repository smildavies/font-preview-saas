'use client'

import { useState } from 'react'
import { useUser } from '@/hooks/useUser'
import { useLocalFonts, type LocalFont } from '@/hooks/useLocalFonts'
import Controls from '@/components/Controls'
import GlyphModal from '@/components/GlyphModal'
import MockupModal from '@/components/MockupModal'
import PairingModal from '@/components/PairingModal'
import SimilarFontsPanel from '@/components/SimilarFontsPanel'
import ShareModal from '@/components/ShareModal'

export default function DashboardPage() {
  const { isPro } = useUser()
  const { fonts: allFonts, loading, method, totalCount } = useLocalFonts()

  // Preview settings
  const [text, setText] = useState('Hello World')
  const [fontSize, setFontSize] = useState(42)
  const [letterSpacing, setLetterSpacing] = useState(0)
  const [lineHeight, setLineHeight] = useState(1.3)
  const [textColor, setTextColor] = useState('#e8e8e8')
  const [bgColor, setBgColor] = useState('#0f0f0f')
  const [search, setSearch] = useState('')
  const [bold, setBold] = useState(false)
  const [italic, setItalic] = useState(false)
  const [uppercase, setUppercase] = useState(false)
  const [underline, setUnderline] = useState(false)

  // Modals
  const [glyphFont, setGlyphFont] = useState<LocalFont | null>(null)
  const [mockupFont, setMockupFont] = useState<LocalFont | null>(null)
  const [pairingFont, setPairingFont] = useState<LocalFont | null>(null)
  const [similarFont, setSimilarFont] = useState<LocalFont | null>(null)
  const [showShare, setShowShare] = useState(false)

  // Compare
  const [compareList, setCompareList] = useState<LocalFont[]>([])

  // View mode
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'waterfall' | 'paragraph'>('list')

  // Toast
  const [toast, setToast] = useState('')

  const filteredFonts = allFonts.filter(f =>
    !search || f.family.toLowerCase().includes(search.toLowerCase())
  )

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

  const previewText = uppercase ? (text || 'Hello World').toUpperCase() : (text || 'Hello World')

  return (
    <div className="min-h-screen">
      {/* Controls */}
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
        isPro={isPro}
      />

      {/* Font Grid */}
      <div className="p-6">
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
              <div className="flex gap-1 bg-zinc-900 rounded-lg p-1">
                {(['list', 'grid', 'waterfall', 'paragraph'] as const).map(mode => (
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
                <p className="text-zinc-500">No fonts match &quot;{search}&quot;</p>
              </div>
            ) : (
              <div className={`grid gap-3 ${
                viewMode === 'grid' ? 'grid-cols-1 lg:grid-cols-2' :
                'grid-cols-1'
              }`}>
                {filteredFonts.map((font, fontIndex) => {
                  const FREE_PREVIEW_LIMIT = 20
                  const isLocked = !isPro && fontIndex >= FREE_PREVIEW_LIMIT

                  return (
                  <div
                    key={font.familyId}
                    className="group rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden hover:border-violet-600/50 transition-all"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900/80 border-b border-zinc-800">
                      <button
                        onClick={() => copyToClipboard(font.family, font.family)}
                        className="text-sm font-semibold text-violet-400 hover:text-violet-300 transition"
                        title="Click to copy font name"
                      >
                        {font.family}
                        <span className="ml-2 text-xs text-zinc-600 opacity-0 group-hover:opacity-100 transition">
                          click to copy
                        </span>
                      </button>
                      <div className="flex items-center gap-3 text-xs text-zinc-500">
                        <span>{font.style}</span>
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
                      <div className="relative px-4 py-5 min-h-[60px]" style={{ background: bgColor }}>
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
                      className={`px-4 min-h-[60px] ${
                        viewMode === 'paragraph' ? 'py-6 min-h-[140px] whitespace-pre-wrap' :
                        viewMode === 'waterfall' ? 'py-2' :
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
                      }}
                    >
                      {previewText}
                    </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 px-4 py-2 border-t border-zinc-800 justify-end">
                      <button
                        onClick={() => copyToClipboard(`font-family: "${font.family}", sans-serif;`, `${font.family} CSS`)}
                        className="px-3 py-1 text-xs border border-zinc-700 rounded-md text-zinc-400 hover:text-white hover:border-zinc-500 transition"
                      >
                        Copy CSS
                      </button>
                      <button
                        onClick={() => isPro ? setGlyphFont(font) : (window.location.href = '/pricing')}
                        className={`px-3 py-1 text-xs border rounded-md transition flex items-center gap-1 ${
                          isPro
                            ? 'border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500'
                            : 'border-zinc-700/50 text-zinc-600 hover:border-violet-700/50 hover:text-violet-400'
                        }`}
                      >
                        {!isPro && <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>}
                        Glyphs
                      </button>
                      <button
                        onClick={() => isPro ? handleCompare(font) : (window.location.href = '/pricing')}
                        className={`px-3 py-1 text-xs border rounded-md transition flex items-center gap-1 ${
                          isPro
                            ? 'border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500'
                            : 'border-zinc-700/50 text-zinc-600 hover:border-violet-700/50 hover:text-violet-400'
                        }`}
                      >
                        {!isPro && <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>}
                        Compare
                      </button>
                      <button
                        onClick={() => isPro ? handleExportPNG(font) : (window.location.href = '/pricing')}
                        className={`px-3 py-1 text-xs border rounded-md transition flex items-center gap-1 ${
                          isPro
                            ? 'border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500'
                            : 'border-zinc-700/50 text-zinc-600 hover:border-violet-700/50 hover:text-violet-400'
                        }`}
                      >
                        {!isPro && <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>}
                        Export PNG
                      </button>
                      <button
                        onClick={() => isPro ? setMockupFont(font) : (window.location.href = '/pricing')}
                        className={`px-3 py-1 text-xs border rounded-md transition flex items-center gap-1 ${
                          isPro
                            ? 'border-violet-700/50 text-violet-400 hover:bg-violet-600/10'
                            : 'border-zinc-700/50 text-zinc-600 hover:border-violet-700/50 hover:text-violet-400'
                        }`}
                      >
                        {!isPro && <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>}
                        Mockups
                      </button>
                      <button
                        onClick={() => isPro ? setPairingFont(font) : (window.location.href = '/pricing')}
                        className={`px-3 py-1 text-xs border rounded-md transition flex items-center gap-1 ${
                          isPro
                            ? 'border-violet-700/50 text-violet-400 hover:bg-violet-600/10'
                            : 'border-zinc-700/50 text-zinc-600 hover:border-violet-700/50 hover:text-violet-400'
                        }`}
                      >
                        {!isPro && <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>}
                        Pairings
                      </button>
                      <button
                        onClick={() => isPro ? setSimilarFont(font) : (window.location.href = '/pricing')}
                        className={`px-3 py-1 text-xs border rounded-md transition flex items-center gap-1 ${
                          isPro
                            ? 'border-violet-700/50 text-violet-400 hover:bg-violet-600/10'
                            : 'border-zinc-700/50 text-zinc-600 hover:border-violet-700/50 hover:text-violet-400'
                        }`}
                      >
                        {!isPro && <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>}
                        Similar
                      </button>
                    </div>
                  </div>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* Compare Panel */}
      {compareList.length > 0 && isPro && (
        <div className="sticky bottom-0 z-50 border-t-2 border-violet-600 bg-zinc-950 p-5">
          <h3 className="text-sm font-semibold text-zinc-300 mb-3">
            Compare ({compareList.length})
          </h3>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {compareList.map(font => (
              <div key={font.familyId} className="flex-shrink-0 min-w-[250px] bg-zinc-900 border border-zinc-800 rounded-lg p-3 relative">
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
            ))}
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

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-violet-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium shadow-lg z-[999] animate-pulse">
          {toast}
        </div>
      )}
    </div>
  )
}
