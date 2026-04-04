'use client'

import { useState, useEffect } from 'react'

export default function ThemeToggle() {
  const [light, setLight] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('fontPreviewTheme')
    if (saved === 'light') {
      setLight(true)
      document.documentElement.classList.add('light-mode')
    }
  }, [])

  const toggle = () => {
    const next = !light
    setLight(next)
    if (next) {
      document.documentElement.classList.add('light-mode')
      localStorage.setItem('fontPreviewTheme', 'light')
    } else {
      document.documentElement.classList.remove('light-mode')
      localStorage.setItem('fontPreviewTheme', 'dark')
    }
  }

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 transition"
      title="Toggle light/dark mode"
    >
      {light ? 'Dark' : 'Light'}
    </button>
  )
}
