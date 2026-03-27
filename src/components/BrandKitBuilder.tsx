'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-browser'

interface BrandKit {
  id: string
  user_id: string
  name: string
  heading_font: string
  body_font: string
  colors: string[]
}

interface BrandKitBuilderProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  allFonts: string[]
  existingKit?: BrandKit
}

const DEFAULT_COLORS = ['#7c3aed', '#ffffff', '#09090b', '#71717a', '#ec4899']

export default function BrandKitBuilder({
  isOpen,
  onClose,
  userId,
  allFonts,
  existingKit,
}: BrandKitBuilderProps) {
  const supabase = createClient()

  const [name, setName] = useState('')
  const [headingFont, setHeadingFont] = useState('')
  const [bodyFont, setBodyFont] = useState('')
  const [colors, setColors] = useState<string[]>(DEFAULT_COLORS)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (existingKit) {
      setName(existingKit.name)
      setHeadingFont(existingKit.heading_font)
      setBodyFont(existingKit.body_font)
      setColors(existingKit.colors?.length === 5 ? existingKit.colors : DEFAULT_COLORS)
    } else {
      setName('')
      setHeadingFont(allFonts[0] ?? '')
      setBodyFont(allFonts[0] ?? '')
      setColors(DEFAULT_COLORS)
    }
    setError('')
  }, [existingKit, isOpen, allFonts])

  useEffect(() => {
    if (isOpen) {
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose()
      }
      document.addEventListener('keydown', handleEsc)
      return () => document.removeEventListener('keydown', handleEsc)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const updateColor = (index: number, value: string) => {
    setColors(prev => {
      const next = [...prev]
      next[index] = value
      return next
    })
  }

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Kit name is required')
      return
    }
    setSaving(true)
    setError('')

    const payload = {
      user_id: userId,
      name: name.trim(),
      heading_font: headingFont,
      body_font: bodyFont,
      colors,
    }

    let result
    if (existingKit) {
      result = await supabase
        .from('brand_kits')
        .update(payload)
        .eq('id', existingKit.id)
    } else {
      result = await supabase.from('brand_kits').insert(payload)
    }

    if (result.error) {
      setError(result.error.message)
      setSaving(false)
      return
    }

    setSaving(false)
    onClose()
  }

  const COLOR_LABELS = ['Primary', 'Background', 'Text', 'Accent', 'Highlight']

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 flex w-full max-w-4xl flex-col rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-100">
              {existingKit ? 'Edit Brand Kit' : 'Create Brand Kit'}
            </h2>
            <p className="text-sm text-zinc-500">Define your brand typography and colors</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form */}
            <div className="space-y-6">
              {/* Kit Name */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Kit Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. My Brand, Client Project"
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-violet-600 focus:outline-none focus:ring-1 focus:ring-violet-600 transition"
                />
              </div>

              {/* Heading Font */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Heading Font</label>
                <select
                  value={headingFont}
                  onChange={e => setHeadingFont(e.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-100 focus:border-violet-600 focus:outline-none focus:ring-1 focus:ring-violet-600 transition"
                >
                  {allFonts.map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              {/* Body Font */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Body Font</label>
                <select
                  value={bodyFont}
                  onChange={e => setBodyFont(e.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-100 focus:border-violet-600 focus:outline-none focus:ring-1 focus:ring-violet-600 transition"
                >
                  {allFonts.map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              {/* Color Palette */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-3">Color Palette</label>
                <div className="grid grid-cols-5 gap-3">
                  {colors.map((color, i) => (
                    <div key={i} className="flex flex-col items-center gap-1.5">
                      <label
                        className="relative w-12 h-12 rounded-lg border border-zinc-700 cursor-pointer overflow-hidden hover:border-violet-500 transition group"
                        style={{ backgroundColor: color }}
                      >
                        <input
                          type="color"
                          value={color}
                          onChange={e => updateColor(i, e.target.value)}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/30">
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </div>
                      </label>
                      <span className="text-[10px] text-zinc-500">{COLOR_LABELS[i]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Preview */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-3">Live Preview</label>
              <div
                className="rounded-xl border border-zinc-700 overflow-hidden"
                style={{ backgroundColor: colors[1] || '#ffffff' }}
              >
                {/* Mini card header */}
                <div
                  className="px-5 py-4"
                  style={{ backgroundColor: colors[0] || '#7c3aed' }}
                >
                  <h3
                    className="text-xl font-bold"
                    style={{
                      fontFamily: `"${headingFont}", sans-serif`,
                      color: colors[1] || '#ffffff',
                    }}
                  >
                    {name || 'Brand Kit Preview'}
                  </h3>
                </div>

                {/* Card body */}
                <div className="px-5 py-5 space-y-3">
                  <h4
                    className="text-lg font-semibold"
                    style={{
                      fontFamily: `"${headingFont}", sans-serif`,
                      color: colors[2] || '#09090b',
                    }}
                  >
                    Heading Typography
                  </h4>
                  <p
                    className="text-sm leading-relaxed"
                    style={{
                      fontFamily: `"${bodyFont}", sans-serif`,
                      color: colors[3] || '#71717a',
                    }}
                  >
                    This is how your body text will look. The quick brown fox jumps over the lazy dog.
                    Typography creates the voice of your brand.
                  </p>
                  <div className="flex gap-2 pt-2">
                    <span
                      className="inline-block rounded-full px-3 py-1 text-xs font-medium"
                      style={{
                        backgroundColor: colors[4] || '#ec4899',
                        color: colors[1] || '#ffffff',
                        fontFamily: `"${bodyFont}", sans-serif`,
                      }}
                    >
                      Highlight Tag
                    </span>
                    <span
                      className="inline-block rounded-full px-3 py-1 text-xs font-medium"
                      style={{
                        backgroundColor: colors[0] || '#7c3aed',
                        color: colors[1] || '#ffffff',
                        fontFamily: `"${bodyFont}", sans-serif`,
                      }}
                    >
                      Primary Tag
                    </span>
                  </div>
                </div>

                {/* Color bar */}
                <div className="flex h-3">
                  {colors.map((c, i) => (
                    <div key={i} className="flex-1" style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-zinc-800 px-6 py-4">
          <div>
            {error && (
              <p className="text-sm text-red-400">{error}</p>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-400 hover:text-white hover:border-zinc-500 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg bg-violet-600 px-6 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
            >
              {saving && (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              )}
              {saving ? 'Saving...' : existingKit ? 'Update Kit' : 'Save Kit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
