'use client'

import { useState, useEffect } from 'react'

interface CSSGeneratorProps {
  fontFamily: string
  onClose: () => void
}

type Format = 'basic' | 'full' | 'tailwind' | 'variable'

function generateCSS(fontFamily: string, format: Format): string {
  const fallback = fontFamily.toLowerCase().includes('serif') ? 'Georgia, "Times New Roman", serif' :
                   fontFamily.toLowerCase().includes('mono') ? '"Courier New", monospace' :
                   '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'

  if (format === 'basic') {
    return `font-family: "${fontFamily}", ${fallback};`
  }
  if (format === 'full') {
    return `/* Heading */\n.heading {\n  font-family: "${fontFamily}", ${fallback};\n  font-weight: 700;\n  font-size: clamp(1.5rem, 4vw, 3rem);\n  line-height: 1.2;\n  letter-spacing: -0.02em;\n}\n\n/* Body */\n.body {\n  font-family: "${fontFamily}", ${fallback};\n  font-weight: 400;\n  font-size: clamp(1rem, 2vw, 1.125rem);\n  line-height: 1.6;\n}\n\n/* Caption */\n.caption {\n  font-family: "${fontFamily}", ${fallback};\n  font-weight: 300;\n  font-size: 0.875rem;\n  line-height: 1.4;\n  letter-spacing: 0.02em;\n}`
  }
  if (format === 'tailwind') {
    const safeName = fontFamily.replace(/\s+/g, '-').toLowerCase()
    return `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      fontFamily: {\n        '${safeName}': ['"${fontFamily}"', ...defaultTheme.fontFamily.sans],\n      },\n    },\n  },\n}\n\n// Usage:\n// <h1 className="font-${safeName}">Hello</h1>`
  }
  return `:root {\n  --font-primary: "${fontFamily}", ${fallback};\n}\n\nh1, h2, h3 {\n  font-family: var(--font-primary);\n}\n\nbody {\n  font-family: var(--font-primary);\n}`
}

export default function CSSGenerator({ fontFamily, onClose }: CSSGeneratorProps) {
  const [format, setFormat] = useState<Format>('basic')
  const [copied, setCopied] = useState(false)

  // Escape key handler
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  const code = generateCSS(fontFamily, format)

  const copy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white">CSS Code Generator</h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition">&times;</button>
        </div>
        <div className="text-xs text-violet-400 mb-3" style={{ fontFamily: `"${fontFamily}", sans-serif` }}>
          {fontFamily}
        </div>
        <pre className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-xs text-zinc-300 overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed max-h-64 overflow-y-auto">
          {code}
        </pre>
        <div className="flex gap-2 mt-4">
          <button onClick={copy} className="flex-1 py-2.5 rounded-lg text-sm font-medium bg-violet-600 hover:bg-violet-500 text-white transition">
            {copied ? 'Copied!' : 'Copy to Clipboard'}
          </button>
          <select
            value={format}
            onChange={e => setFormat(e.target.value as Format)}
            className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 text-xs text-zinc-300 focus:outline-none"
          >
            <option value="basic">Basic</option>
            <option value="full">Full Stack</option>
            <option value="tailwind">Tailwind</option>
            <option value="variable">CSS Variable</option>
          </select>
        </div>
      </div>
    </div>
  )
}
