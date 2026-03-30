'use client'

import { useState, useRef } from 'react'

interface WeddingTemplatesProps {
  fontFamily: string
  onClose: () => void
}

interface Template {
  name: string
  category: string
  fields: { label: string; defaultValue: string; fontSize: number; fontWeight?: string; letterSpacing?: string; opacity?: number }[]
  bg: string
  textColor: string
  accentColor: string
  containerStyle: React.CSSProperties
}

const TEMPLATES: Template[] = [
  {
    name: 'Wedding Invitation - Classic',
    category: 'wedding',
    fields: [
      { label: 'Header', defaultValue: 'Together with their families', fontSize: 12, opacity: 0.6, letterSpacing: '0.15em' },
      { label: 'Name 1', defaultValue: 'Emma Rose', fontSize: 36, fontWeight: 'normal' },
      { label: 'Conjunction', defaultValue: '&', fontSize: 28, opacity: 0.5 },
      { label: 'Name 2', defaultValue: 'James William', fontSize: 36, fontWeight: 'normal' },
      { label: 'Invite text', defaultValue: 'request the pleasure of your company\nat the celebration of their marriage', fontSize: 11, opacity: 0.6, letterSpacing: '0.1em' },
      { label: 'Date', defaultValue: 'Saturday, the twenty-first of June', fontSize: 14, letterSpacing: '0.12em' },
      { label: 'Time & Place', defaultValue: 'at five o\'clock in the evening\nThe Grand Ballroom, New York', fontSize: 11, opacity: 0.6 },
    ],
    bg: 'linear-gradient(180deg, #fef9f0 0%, #fdf6e9 100%)',
    textColor: '#3d2c1e',
    accentColor: '#c9a96e',
    containerStyle: { width: '340px', padding: '50px 40px', border: '1px solid #e8dcc8', borderRadius: '0' },
  },
  {
    name: 'Wedding Invitation - Modern',
    category: 'wedding',
    fields: [
      { label: 'Name 1', defaultValue: 'SOPHIA', fontSize: 42, fontWeight: 'bold', letterSpacing: '0.3em' },
      { label: 'Conjunction', defaultValue: 'and', fontSize: 20, opacity: 0.5 },
      { label: 'Name 2', defaultValue: 'ALEXANDER', fontSize: 42, fontWeight: 'bold', letterSpacing: '0.3em' },
      { label: 'Date', defaultValue: '06 . 21 . 2026', fontSize: 14, letterSpacing: '0.2em' },
      { label: 'Venue', defaultValue: 'THE RITZ CARLTON\nNEW YORK CITY', fontSize: 10, letterSpacing: '0.25em', opacity: 0.6 },
    ],
    bg: 'linear-gradient(180deg, #ffffff 0%, #fafafa 100%)',
    textColor: '#111111',
    accentColor: '#999999',
    containerStyle: { width: '340px', padding: '60px 40px', border: '2px solid #111', borderRadius: '0' },
  },
  {
    name: 'Save the Date',
    category: 'wedding',
    fields: [
      { label: 'Header', defaultValue: 'SAVE THE DATE', fontSize: 12, letterSpacing: '0.35em', fontWeight: 'bold' },
      { label: 'Name 1', defaultValue: 'Olivia', fontSize: 38 },
      { label: 'Conjunction', defaultValue: '&', fontSize: 32, opacity: 0.4 },
      { label: 'Name 2', defaultValue: 'Ethan', fontSize: 38 },
      { label: 'Date', defaultValue: 'August 15, 2026', fontSize: 16, letterSpacing: '0.1em' },
      { label: 'Location', defaultValue: 'Napa Valley, California', fontSize: 11, opacity: 0.6, letterSpacing: '0.1em' },
    ],
    bg: 'linear-gradient(135deg, #2d3436 0%, #1a1a2e 100%)',
    textColor: '#f5f0e8',
    accentColor: '#c9a96e',
    containerStyle: { width: '340px', padding: '50px 40px', border: '1px solid rgba(201,169,110,0.3)', borderRadius: '0' },
  },
  {
    name: 'Birthday Party',
    category: 'party',
    fields: [
      { label: 'Header', defaultValue: 'YOU\'RE INVITED TO', fontSize: 10, letterSpacing: '0.3em', opacity: 0.6 },
      { label: 'Name', defaultValue: 'Ava\'s', fontSize: 36 },
      { label: 'Event', defaultValue: 'Birthday Party', fontSize: 24 },
      { label: 'Date', defaultValue: 'Saturday, March 15th', fontSize: 13, letterSpacing: '0.1em' },
      { label: 'Time', defaultValue: '2:00 PM - 5:00 PM', fontSize: 12, opacity: 0.7 },
      { label: 'Location', defaultValue: 'Sunshine Park Pavilion\n123 Oak Street', fontSize: 11, opacity: 0.6 },
    ],
    bg: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #f5d0fe 100%)',
    textColor: '#831843',
    accentColor: '#ec4899',
    containerStyle: { width: '340px', padding: '45px 35px', border: '2px solid #f9a8d4', borderRadius: '16px' },
  },
  {
    name: 'Baby Shower',
    category: 'party',
    fields: [
      { label: 'Header', defaultValue: 'PLEASE JOIN US FOR A', fontSize: 9, letterSpacing: '0.3em', opacity: 0.6 },
      { label: 'Event', defaultValue: 'Baby Shower', fontSize: 32 },
      { label: 'Honoring', defaultValue: 'honoring', fontSize: 12, opacity: 0.5 },
      { label: 'Name', defaultValue: 'Sarah & David', fontSize: 24 },
      { label: 'Date', defaultValue: 'Sunday, April 20th at 2 PM', fontSize: 12, letterSpacing: '0.08em' },
      { label: 'Location', defaultValue: 'The Garden Room\n456 Elm Avenue', fontSize: 11, opacity: 0.6 },
    ],
    bg: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
    textColor: '#064e3b',
    accentColor: '#34d399',
    containerStyle: { width: '340px', padding: '45px 35px', border: '2px solid #a7f3d0', borderRadius: '16px' },
  },
  {
    name: 'Dinner Menu',
    category: 'wedding',
    fields: [
      { label: 'Header', defaultValue: 'MENU', fontSize: 14, letterSpacing: '0.4em', fontWeight: 'bold' },
      { label: 'Course 1', defaultValue: 'First Course', fontSize: 12, letterSpacing: '0.15em', opacity: 0.5 },
      { label: 'Dish 1', defaultValue: 'Heirloom Tomato Gazpacho\nwith basil oil & croutons', fontSize: 13 },
      { label: 'Course 2', defaultValue: 'Main Course', fontSize: 12, letterSpacing: '0.15em', opacity: 0.5 },
      { label: 'Dish 2', defaultValue: 'Pan-Seared Chilean Sea Bass\nwith lemon beurre blanc', fontSize: 13 },
      { label: 'Course 3', defaultValue: 'Dessert', fontSize: 12, letterSpacing: '0.15em', opacity: 0.5 },
      { label: 'Dish 3', defaultValue: 'Vanilla Bean Crème Brûlée\nwith fresh berries', fontSize: 13 },
    ],
    bg: 'linear-gradient(180deg, #fefce8 0%, #fef9c3 100%)',
    textColor: '#422006',
    accentColor: '#a16207',
    containerStyle: { width: '280px', padding: '40px 30px', border: '1px solid #e5d5a0', borderRadius: '0' },
  },
]

const CATEGORIES = ['all', 'wedding', 'party']

export default function WeddingTemplates({ fontFamily, onClose }: WeddingTemplatesProps) {
  const [selectedTemplate, setSelectedTemplate] = useState(0)
  const [category, setCategory] = useState('all')
  const [customFields, setCustomFields] = useState<Record<string, string>>({})
  const canvasRef = useRef<HTMLDivElement>(null)

  const filtered = category === 'all' ? TEMPLATES : TEMPLATES.filter(t => t.category === category)
  const template = filtered[selectedTemplate] || TEMPLATES[0]

  const getFieldValue = (fieldLabel: string, defaultValue: string) => {
    const key = `${template.name}-${fieldLabel}`
    return customFields[key] !== undefined ? customFields[key] : defaultValue
  }

  const setFieldValue = (fieldLabel: string, value: string) => {
    const key = `${template.name}-${fieldLabel}`
    setCustomFields(prev => ({ ...prev, [key]: value }))
  }

  const exportPNG = async () => {
    if (!canvasRef.current) return
    const html2canvas = (await import('html2canvas')).default
    const canvas = await html2canvas(canvasRef.current, { backgroundColor: null, scale: 3 })
    const link = document.createElement('a')
    link.download = `${template.name.toLowerCase().replace(/\s/g, '-')}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-rose-400 to-amber-300 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Wedding & Event Templates</h2>
              <p className="text-xs text-zinc-500">Preview &ldquo;{fontFamily}&rdquo; on invitations, menus & more</p>
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
                onClick={() => { setCategory(cat); setSelectedTemplate(0) }}
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Preview */}
            <div className="flex items-center justify-center">
              <div
                ref={canvasRef}
                className="flex items-center justify-center rounded-lg p-8"
                style={{ background: template.bg }}
              >
                <div style={template.containerStyle} className="text-center space-y-3">
                  {template.fields.map((field, i) => (
                    <div
                      key={i}
                      className="whitespace-pre-line"
                      style={{
                        fontFamily: `"${fontFamily}", serif`,
                        fontSize: `${field.fontSize}px`,
                        fontWeight: field.fontWeight || 'normal',
                        letterSpacing: field.letterSpacing || 'normal',
                        color: template.textColor,
                        opacity: field.opacity || 1,
                        lineHeight: 1.4,
                      }}
                    >
                      {getFieldValue(field.label, field.defaultValue)}
                    </div>
                  ))}
                  {/* Decorative line */}
                  <div className="pt-2">
                    <div style={{ width: '60px', height: '1px', backgroundColor: template.accentColor, margin: '0 auto', opacity: 0.5 }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-4">
              {/* Template selector */}
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2">Template</label>
                <div className="grid grid-cols-2 gap-2">
                  {filtered.map((t, i) => (
                    <button
                      key={t.name}
                      onClick={() => setSelectedTemplate(i)}
                      className={`text-left px-3 py-2.5 rounded-lg text-xs transition ${
                        selectedTemplate === i
                          ? 'bg-violet-600/20 border border-violet-600/40 text-violet-400'
                          : 'bg-zinc-800 border border-zinc-700/50 text-zinc-400 hover:border-zinc-600'
                      }`}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Editable fields */}
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2">Customize Text</label>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {template.fields.map((field, i) => (
                    <div key={i}>
                      <label className="block text-[10px] text-zinc-600 mb-0.5">{field.label}</label>
                      <input
                        type="text"
                        value={getFieldValue(field.label, field.defaultValue)}
                        onChange={e => setFieldValue(field.label, e.target.value)}
                        className="w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs text-white focus:border-violet-600 focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Export */}
              <button onClick={exportPNG} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-violet-600 hover:bg-violet-500 text-white transition">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Export PNG
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
