'use client'

import { useState, useRef } from 'react'

interface CrafterMockupsProps {
  fontFamily: string
  onClose: () => void
}

const MOCKUPS = [
  {
    name: 'Coffee Mug',
    category: 'drinkware',
    bg: 'linear-gradient(135deg, #f5f5f4 0%, #e7e5e4 100%)',
    containerBg: '#ffffff',
    textColor: '#1c1917',
    containerStyle: {
      width: '220px', height: '180px', borderRadius: '0 50px 50px 0',
      border: '3px solid #d6d3d1',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px',
      boxShadow: '4px 4px 16px rgba(0,0,0,0.1)',
    } as React.CSSProperties,
    defaultText: 'But First\nCoffee',
    fontSize: 22,
  },
  {
    name: 'Tumbler',
    category: 'drinkware',
    bg: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
    containerBg: 'linear-gradient(180deg, #6366f1 0%, #4f46e5 100%)',
    textColor: '#ffffff',
    containerStyle: {
      width: '120px', height: '260px', borderRadius: '10px 10px 30px 30px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '15px',
      boxShadow: '0 8px 24px rgba(99,102,241,0.3)',
    } as React.CSSProperties,
    defaultText: 'Living My\nBest Life',
    fontSize: 16,
  },
  {
    name: 'Tote Bag',
    category: 'apparel',
    bg: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
    containerBg: '#f5f0e4',
    textColor: '#292524',
    containerStyle: {
      width: '240px', height: '260px', borderRadius: '0 0 8px 8px',
      borderTop: '6px solid #a8a29e',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '30px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    } as React.CSSProperties,
    defaultText: 'Market\nFresh',
    fontSize: 28,
  },
  {
    name: 'Wooden Sign',
    category: 'home',
    bg: 'linear-gradient(135deg, #d6cbbf 0%, #c4b5a4 100%)',
    containerBg: '#8B7355',
    textColor: '#fef3c7',
    containerStyle: {
      width: '280px', height: '160px', borderRadius: '4px',
      border: '4px solid #6b5c45',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px',
      boxShadow: 'inset 0 0 30px rgba(0,0,0,0.2), 0 4px 12px rgba(0,0,0,0.2)',
      background: 'linear-gradient(180deg, #9a8468 0%, #7a6548 50%, #8B7355 100%)',
    } as React.CSSProperties,
    defaultText: 'Welcome to\nOur Home',
    fontSize: 22,
  },
  {
    name: 'Sticker / Decal',
    category: 'stickers',
    bg: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
    containerBg: '#ffffff',
    textColor: '#166534',
    containerStyle: {
      width: '200px', height: '200px', borderRadius: '50%',
      border: '3px dashed #86efac',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '30px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    } as React.CSSProperties,
    defaultText: 'Plant\nMom',
    fontSize: 24,
  },
  {
    name: 'T-Shirt',
    category: 'apparel',
    bg: 'linear-gradient(135deg, #18181b 0%, #27272a 100%)',
    containerBg: '#27272a',
    textColor: '#ffffff',
    containerStyle: {
      width: '220px', height: '260px', borderRadius: '40px 40px 8px 8px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '30px',
      border: '2px solid #3f3f46',
    } as React.CSSProperties,
    defaultText: 'Stay\nCreative',
    fontSize: 26,
  },
  {
    name: 'Wine Glass',
    category: 'drinkware',
    bg: 'linear-gradient(135deg, #4a1d42 0%, #2d1028 100%)',
    containerBg: 'transparent',
    textColor: '#f9a8d4',
    containerStyle: {
      width: '100px', height: '200px',
      borderRadius: '50% 50% 10px 10px',
      border: '2px solid rgba(249,168,212,0.3)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '15px',
    } as React.CSSProperties,
    defaultText: 'Wine\nTime',
    fontSize: 18,
  },
  {
    name: 'Throw Pillow',
    category: 'home',
    bg: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)',
    containerBg: '#fff1f2',
    textColor: '#9f1239',
    containerStyle: {
      width: '220px', height: '220px', borderRadius: '16px',
      border: '2px solid #fda4af',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '30px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
    } as React.CSSProperties,
    defaultText: 'Home\nSweet\nHome',
    fontSize: 22,
  },
  {
    name: 'Mason Jar',
    category: 'drinkware',
    bg: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
    containerBg: 'rgba(255,255,255,0.4)',
    textColor: '#064e3b',
    containerStyle: {
      width: '130px', height: '200px', borderRadius: '8px',
      border: '2px solid #a7f3d0',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '15px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    } as React.CSSProperties,
    defaultText: 'Sweet\nTea',
    fontSize: 20,
  },
  {
    name: 'Canvas Print',
    category: 'home',
    bg: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
    containerBg: '#ffffff',
    textColor: '#581c87',
    containerStyle: {
      width: '260px', height: '180px', borderRadius: '2px',
      border: '6px solid #e9d5ff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
      boxShadow: '4px 4px 0 #d8b4fe',
    } as React.CSSProperties,
    defaultText: 'Be Kind\nAlways',
    fontSize: 26,
  },
]

const CATEGORIES = ['all', 'drinkware', 'apparel', 'home', 'stickers']

export default function CrafterMockups({ fontFamily, onClose }: CrafterMockupsProps) {
  const [selectedMockup, setSelectedMockup] = useState(0)
  const [customText, setCustomText] = useState('')
  const [category, setCategory] = useState('all')
  const canvasRef = useRef<HTMLDivElement>(null)

  const filtered = category === 'all' ? MOCKUPS : MOCKUPS.filter(m => m.category === category)
  const mockup = filtered[selectedMockup] || MOCKUPS[0]
  const displayText = customText || mockup.defaultText

  const exportPNG = async () => {
    if (!canvasRef.current) return
    const html2canvas = (await import('html2canvas')).default
    const canvas = await html2canvas(canvasRef.current, { backgroundColor: null, scale: 3 })
    const link = document.createElement('a')
    link.download = `${mockup.name.toLowerCase().replace(/\s/g, '-')}-mockup.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Crafter Mockups</h2>
              <p className="text-xs text-zinc-500">Preview &ldquo;{fontFamily}&rdquo; on mugs, shirts, signs & more</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white transition rounded-lg hover:bg-zinc-800">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Category filter */}
          <div className="flex gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => { setCategory(cat); setSelectedMockup(0) }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition ${
                  category === cat
                    ? 'bg-violet-600/20 text-violet-400 border border-violet-600/40'
                    : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-zinc-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Custom text */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">Custom Text (use Enter for line breaks)</label>
            <textarea
              value={customText}
              onChange={e => setCustomText(e.target.value)}
              placeholder={mockup.defaultText.replace(/\n/g, ', ')}
              rows={2}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-white text-sm focus:border-violet-600 focus:outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Preview */}
            <div
              ref={canvasRef}
              className="rounded-xl flex items-center justify-center min-h-[350px]"
              style={{ background: mockup.bg }}
            >
              <div style={{ ...mockup.containerStyle, background: mockup.containerBg }}>
                <div
                  className="text-center whitespace-pre-line leading-tight"
                  style={{
                    fontFamily: `"${fontFamily}", sans-serif`,
                    fontSize: `${mockup.fontSize}px`,
                    color: mockup.textColor,
                  }}
                >
                  {displayText}
                </div>
              </div>
            </div>

            {/* Mockup selector grid */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-3">Choose Mockup</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {filtered.map((m, i) => (
                  <button
                    key={m.name}
                    onClick={() => setSelectedMockup(i)}
                    className={`rounded-xl p-4 flex flex-col items-center gap-2 transition ${
                      selectedMockup === i
                        ? 'ring-2 ring-violet-500 bg-zinc-800'
                        : 'bg-zinc-800/50 border border-zinc-700/50 hover:bg-zinc-800'
                    }`}
                  >
                    <div
                      className="w-full h-20 rounded-lg flex items-center justify-center"
                      style={{ background: m.bg }}
                    >
                      <span
                        className="text-xs font-medium"
                        style={{ color: m.textColor, fontFamily: `"${fontFamily}", sans-serif` }}
                      >
                        Aa
                      </span>
                    </div>
                    <span className="text-xs text-zinc-400">{m.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Export */}
          <div className="flex gap-3">
            <button onClick={exportPNG} className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium bg-violet-600 hover:bg-violet-500 text-white transition">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Export PNG
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
