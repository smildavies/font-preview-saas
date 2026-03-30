'use client'

import { useState, useEffect } from 'react'

export default function BrowserBanner() {
  const [show, setShow] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Only show on non-Chromium browsers (Safari, Firefox)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isChromium = !!(window as any).chrome
    const wasDismissed = localStorage.getItem('fontpreview-banner-dismissed')
    if (!isChromium && !wasDismissed) {
      setShow(true)
    }
  }, [])

  const handleDismiss = () => {
    setDismissed(true)
    setShow(false)
    localStorage.setItem('fontpreview-banner-dismissed', 'true')
  }

  if (!show || dismissed) return null

  return (
    <div className="bg-violet-600/10 border-b border-violet-600/20 px-6 py-3 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <svg className="w-5 h-5 text-violet-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
        <p className="text-sm text-zinc-300">
          <span className="font-medium text-violet-400">Want to see ALL your installed fonts?</span>
          {' '}Open My Font Preview in Chrome or Edge for full font detection. You can also browse 1,500+ Google Fonts below.
        </p>
      </div>
      <button
        onClick={handleDismiss}
        className="text-zinc-500 hover:text-white transition flex-shrink-0 p-1"
        title="Dismiss"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}
