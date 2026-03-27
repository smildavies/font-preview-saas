'use client'

import { useState, useEffect, useMemo } from 'react'

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  allFonts: string[]
}

export default function ShareModal({ isOpen, onClose, allFonts }: ShareModalProps) {
  const [name, setName] = useState('')
  const [search, setSearch] = useState('')
  const [selectedFonts, setSelectedFonts] = useState<string[]>([])
  const [generatedUrl, setGeneratedUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setName('')
      setSearch('')
      setSelectedFonts([])
      setGeneratedUrl('')
      setError('')
      setCopied(false)
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose()
      }
      document.addEventListener('keydown', handleEsc)
      return () => document.removeEventListener('keydown', handleEsc)
    }
  }, [isOpen, onClose])

  const filteredFonts = useMemo(() => {
    if (!search.trim()) return allFonts.slice(0, 50)
    const q = search.toLowerCase()
    return allFonts.filter(f => f.toLowerCase().includes(q)).slice(0, 50)
  }, [allFonts, search])

  const addFont = (font: string) => {
    if (!selectedFonts.includes(font)) {
      setSelectedFonts(prev => [...prev, font])
    }
    setSearch('')
  }

  const removeFont = (font: string) => {
    setSelectedFonts(prev => prev.filter(f => f !== font))
  }

  const handleGenerate = async () => {
    if (!name.trim()) {
      setError('Collection name is required')
      return
    }
    if (selectedFonts.length === 0) {
      setError('Select at least one font')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/share/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), fonts: selectedFonts }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to create share link')
        setLoading(false)
        return
      }

      setGeneratedUrl(data.url)
    } catch {
      setError('Failed to create share link')
    }

    setLoading(false)
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 flex w-full max-w-2xl flex-col rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-100">Share Font Collection</h2>
            <p className="text-sm text-zinc-500">Create a link for clients to review and vote on fonts</p>
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
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!generatedUrl ? (
            <>
              {/* Collection Name */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Collection Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Website Rebrand Options"
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-violet-600 focus:outline-none focus:ring-1 focus:ring-violet-600 transition"
                />
              </div>

              {/* Font Selector */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Select Fonts ({selectedFonts.length} selected)
                </label>

                {/* Selected chips */}
                {selectedFonts.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selectedFonts.map(font => (
                      <span
                        key={font}
                        className="inline-flex items-center gap-1.5 rounded-full bg-violet-600/20 border border-violet-600/30 px-3 py-1 text-xs font-medium text-violet-300"
                      >
                        {font}
                        <button
                          onClick={() => removeFont(font)}
                          className="text-violet-400 hover:text-white transition"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Search input */}
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Type to search fonts..."
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-violet-600 focus:outline-none focus:ring-1 focus:ring-violet-600 transition"
                />

                {/* Dropdown list */}
                {search.trim() && (
                  <div className="mt-1 max-h-48 overflow-y-auto rounded-lg border border-zinc-700 bg-zinc-900">
                    {filteredFonts.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-zinc-500">No fonts found</div>
                    ) : (
                      filteredFonts.map(font => {
                        const isSelected = selectedFonts.includes(font)
                        return (
                          <button
                            key={font}
                            onClick={() => !isSelected && addFont(font)}
                            disabled={isSelected}
                            className={`w-full text-left px-4 py-2 text-sm transition ${
                              isSelected
                                ? 'text-zinc-600 cursor-default'
                                : 'text-zinc-300 hover:bg-zinc-800 hover:text-white cursor-pointer'
                            }`}
                            style={{ fontFamily: `"${font}", sans-serif` }}
                          >
                            {font}
                            {isSelected && (
                              <span className="ml-2 text-xs text-violet-500">added</span>
                            )}
                          </button>
                        )
                      })
                    )}
                  </div>
                )}
              </div>

              {error && (
                <p className="text-sm text-red-400">{error}</p>
              )}
            </>
          ) : (
            /* Generated Link */
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-emerald-400 mb-2">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium">Share link created! Valid for 30 days.</span>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={generatedUrl}
                  readOnly
                  className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-100 focus:outline-none"
                />
                <button
                  onClick={handleCopy}
                  className={`rounded-lg px-5 py-2.5 text-sm font-medium transition flex items-center gap-2 ${
                    copied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-violet-600 text-white hover:bg-violet-700'
                  }`}
                >
                  {copied ? (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                      </svg>
                      Copy Link
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs text-zinc-500">
                Anyone with this link can view the fonts and vote on them. No login required.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {!generatedUrl && (
          <div className="flex items-center justify-end border-t border-zinc-800 px-6 py-4 gap-3">
            <button
              onClick={onClose}
              className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-400 hover:text-white hover:border-zinc-500 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="rounded-lg bg-violet-600 px-6 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
            >
              {loading && (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              )}
              {loading ? 'Generating...' : 'Generate Link'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
