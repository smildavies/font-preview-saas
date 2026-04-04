'use client'

import { useEffect, useState, useCallback } from 'react'

export type GoogleFont = {
  family: string
  category: string
  variants: string[]
}

export function useGoogleFonts(enabled: boolean = true) {
  const [fonts, setFonts] = useState<GoogleFont[]>([])
  const [loading, setLoading] = useState(false)
  const [loadedFamilies, setLoadedFamilies] = useState<Set<string>>(new Set())

  const fetchFonts = useCallback(async () => {
    if (!enabled) return
    setLoading(true)
    try {
      const resp = await fetch('/api/fonts/google')
      const data = await resp.json()
      if (data.items) {
        setFonts(data.items.map((f: { family: string; category: string; variants: string[] }) => ({
          family: f.family,
          category: f.category,
          variants: f.variants,
        })))
      }
    } catch {
      // Fallback: use a static subset if API fails
      setFonts([])
    }
    setLoading(false)
  }, [enabled])

  useEffect(() => {
    fetchFonts()
  }, [fetchFonts])

  // Load a specific Google Font into the page via CSS link
  const loadFont = useCallback((family: string) => {
    if (loadedFamilies.has(family)) return
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@400;700&display=swap`
    document.head.appendChild(link)
    setLoadedFamilies(prev => new Set(prev).add(family))
  }, [loadedFamilies])

  return { fonts, loading, loadFont, totalCount: fonts.length }
}
