'use client'

import { useState, useEffect, useCallback } from 'react'

interface VariableAxesEditorProps {
  fontFamily: string
  onClose: () => void
}

interface FontAxis {
  tag: string
  name: string
  min: number
  max: number
  default: number
}

const KNOWN_AXES: Record<string, { name: string; min: number; max: number; default: number }> = {
  wght: { name: 'Weight', min: 100, max: 900, default: 400 },
  wdth: { name: 'Width', min: 75, max: 125, default: 100 },
  slnt: { name: 'Slant', min: -12, max: 0, default: 0 },
  ital: { name: 'Italic', min: 0, max: 1, default: 0 },
  opsz: { name: 'Optical Size', min: 8, max: 144, default: 14 },
  GRAD: { name: 'Grade', min: -200, max: 150, default: 0 },
  CASL: { name: 'Casual', min: 0, max: 1, default: 0 },
  CRSV: { name: 'Cursive', min: 0, max: 1, default: 0.5 },
  MONO: { name: 'Monospace', min: 0, max: 1, default: 0 },
  FILL: { name: 'Fill', min: 0, max: 1, default: 0 },
}

export default function VariableAxesEditor({ fontFamily, onClose }: VariableAxesEditorProps) {
  const [axes, setAxes] = useState<FontAxis[]>([])
  const [values, setValues] = useState<Record<string, number>>({})
  const [previewText, setPreviewText] = useState('The quick brown fox jumps over the lazy dog')
  const [isVariable, setIsVariable] = useState<boolean | null>(null)

  // Escape key handler
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  useEffect(() => {
    // Try to detect variable font axes via the document.fonts API
    const detectAxes = async () => {
      try {
        // Check if font supports variation settings by testing known axes
        const detectedAxes: FontAxis[] = []

        for (const [tag, info] of Object.entries(KNOWN_AXES)) {
          // Try rendering with different axis values — if the font supports it,
          // the measured width will differ
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          if (!ctx) continue

          const testStr = 'ABCDabcd1234'
          ctx.font = `16px "${fontFamily}"`
          const baseWidth = ctx.measureText(testStr).width

          // Set a variation value
          const el = document.createElement('span')
          el.style.fontFamily = `"${fontFamily}"`
          el.style.fontVariationSettings = `"${tag}" ${info.max}`
          el.style.fontSize = '16px'
          el.style.position = 'absolute'
          el.style.visibility = 'hidden'
          el.textContent = testStr
          document.body.appendChild(el)
          const varWidth = el.offsetWidth
          document.body.removeChild(el)

          // Also test with min value
          const el2 = document.createElement('span')
          el2.style.fontFamily = `"${fontFamily}"`
          el2.style.fontVariationSettings = `"${tag}" ${info.min}`
          el2.style.fontSize = '16px'
          el2.style.position = 'absolute'
          el2.style.visibility = 'hidden'
          el2.textContent = testStr
          document.body.appendChild(el2)
          const minWidth = el2.offsetWidth
          document.body.removeChild(el2)

          if (Math.abs(varWidth - minWidth) > 1) {
            detectedAxes.push({ tag, ...info })
          }
        }

        // Even if we can't detect axes, show standard ones for common variable fonts
        if (detectedAxes.length === 0) {
          // Provide standard axes as fallback — user can try them
          const standardAxes: FontAxis[] = [
            { tag: 'wght', ...KNOWN_AXES.wght },
            { tag: 'wdth', ...KNOWN_AXES.wdth },
            { tag: 'slnt', ...KNOWN_AXES.slnt },
            { tag: 'ital', ...KNOWN_AXES.ital },
            { tag: 'opsz', ...KNOWN_AXES.opsz },
          ]
          setAxes(standardAxes)
          setIsVariable(false)
        } else {
          setAxes(detectedAxes)
          setIsVariable(true)
        }

        // Set default values
        const defaults: Record<string, number> = {}
        const axesToUse = detectedAxes.length > 0 ? detectedAxes : [
          { tag: 'wght', ...KNOWN_AXES.wght },
          { tag: 'wdth', ...KNOWN_AXES.wdth },
          { tag: 'slnt', ...KNOWN_AXES.slnt },
          { tag: 'ital', ...KNOWN_AXES.ital },
          { tag: 'opsz', ...KNOWN_AXES.opsz },
        ]
        for (const axis of axesToUse) {
          defaults[axis.tag] = axis.default
        }
        setValues(defaults)
      } catch {
        setIsVariable(false)
        const standardAxes: FontAxis[] = [
          { tag: 'wght', ...KNOWN_AXES.wght },
          { tag: 'wdth', ...KNOWN_AXES.wdth },
          { tag: 'slnt', ...KNOWN_AXES.slnt },
          { tag: 'ital', ...KNOWN_AXES.ital },
          { tag: 'opsz', ...KNOWN_AXES.opsz },
        ]
        setAxes(standardAxes)
        const defaults: Record<string, number> = {}
        for (const a of standardAxes) defaults[a.tag] = a.default
        setValues(defaults)
      }
    }

    detectAxes()
  }, [fontFamily])

  const handleAxisChange = useCallback((tag: string, value: number) => {
    setValues(prev => ({ ...prev, [tag]: value }))
  }, [])

  const variationSettings = Object.entries(values)
    .map(([tag, val]) => `"${tag}" ${val}`)
    .join(', ')

  const handleCopyCSS = () => {
    const css = `font-family: '${fontFamily}';\nfont-variation-settings: ${variationSettings};`
    navigator.clipboard.writeText(css)
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl w-full max-w-[700px] max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-cyan-400">Variable</span> Font Axes
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">{fontFamily}</p>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white text-2xl leading-none">&times;</button>
        </div>

        {/* Variable status */}
        {isVariable === false && (
          <div className="mx-6 mt-4 px-3 py-2 rounded-lg bg-amber-900/20 border border-amber-800/40 text-amber-400 text-xs">
            This font may not be a variable font. Standard axes are shown — sliders may have no visible effect.
          </div>
        )}
        {isVariable === true && (
          <div className="mx-6 mt-4 px-3 py-2 rounded-lg bg-emerald-900/20 border border-emerald-800/40 text-emerald-400 text-xs">
            Variable font detected! Adjust the axes below to see live changes.
          </div>
        )}

        {/* Preview */}
        <div className="px-6 py-6">
          <input
            type="text"
            value={previewText}
            onChange={e => setPreviewText(e.target.value)}
            className="w-full mb-4 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 focus:border-cyan-600 focus:outline-none"
            placeholder="Preview text..."
          />
          <div
            className="rounded-xl bg-zinc-950 border border-zinc-800 p-6 min-h-[100px] flex items-center justify-center"
            style={{
              fontFamily: `"${fontFamily}", sans-serif`,
              fontSize: '36px',
              color: '#e8e8e8',
              fontVariationSettings: variationSettings,
            }}
          >
            {previewText}
          </div>
        </div>

        {/* Axes sliders */}
        <div className="px-6 pb-4 space-y-4">
          {axes.map(axis => (
            <div key={axis.tag}>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-zinc-400 font-medium">
                  {axis.name} <span className="text-zinc-600">({axis.tag})</span>
                </label>
                <span className="text-xs text-cyan-400 font-mono">{values[axis.tag] ?? axis.default}</span>
              </div>
              <input
                type="range"
                min={axis.min}
                max={axis.max}
                step={axis.tag === 'ital' || axis.tag === 'CASL' || axis.tag === 'CRSV' || axis.tag === 'MONO' || axis.tag === 'FILL' ? 0.01 : 1}
                value={values[axis.tag] ?? axis.default}
                onChange={e => handleAxisChange(axis.tag, Number(e.target.value))}
                className="w-full accent-cyan-500"
              />
              <div className="flex justify-between text-[9px] text-zinc-600 mt-0.5">
                <span>{axis.min}</span>
                <span>{axis.max}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-zinc-800">
          <button
            onClick={() => {
              const defaults: Record<string, number> = {}
              for (const a of axes) defaults[a.tag] = a.default
              setValues(defaults)
            }}
            className="px-3 py-1.5 text-xs rounded-lg border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition"
          >
            Reset All
          </button>
          <button
            onClick={handleCopyCSS}
            className="px-4 py-1.5 text-xs rounded-lg bg-cyan-600 text-white hover:bg-cyan-500 transition font-medium"
          >
            Copy CSS
          </button>
        </div>
      </div>
    </div>
  )
}
