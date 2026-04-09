'use client'

import { useEffect, useState } from 'react'

interface KeyboardShortcutsProps {
  onSearch: () => void
  onOpenMixer?: () => void
  onOpenMonogram?: () => void
  onOpenPairing?: () => void
}

const SHORTCUTS = [
  { key: '/', label: 'Search fonts' },
  { key: 'Esc', label: 'Close modal' },
  { key: 'M', label: 'Font Mixer' },
  { key: 'N', label: 'Monogram Builder' },
  { key: 'P', label: 'AI Pairing' },
  { key: '?', label: 'Show shortcuts' },
]

export default function KeyboardShortcuts({ onSearch, onOpenMixer, onOpenMonogram, onOpenPairing }: KeyboardShortcutsProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return

      if (e.key === '/') { e.preventDefault(); onSearch() }
      if (e.key === '?') setShow(v => !v)
      if (e.key === 'Escape') setShow(false)
      if (e.key === 'm' && onOpenMixer) onOpenMixer()
      if (e.key === 'n' && onOpenMonogram) onOpenMonogram()
      if (e.key === 'p' && onOpenPairing) onOpenPairing()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onSearch, onOpenMixer, onOpenMonogram, onOpenPairing])

  if (!show) return null

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShow(false)}>
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 min-w-[340px] shadow-2xl" onClick={e => e.stopPropagation()}>
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <span className="text-lg">Keyboard Shortcuts</span>
        </h3>
        <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
          {SHORTCUTS.map(s => (
            <div key={s.key} className="contents">
              <kbd className="bg-zinc-800 border border-zinc-700 rounded px-2 py-0.5 text-xs text-violet-400 font-mono">{s.key}</kbd>
              <span className="text-sm text-zinc-400">{s.label}</span>
            </div>
          ))}
        </div>
        <button onClick={() => setShow(false)} className="mt-4 w-full py-2 rounded-lg border border-zinc-700 text-zinc-400 text-xs hover:bg-zinc-800 transition">
          Close
        </button>
      </div>
    </div>
  )
}
