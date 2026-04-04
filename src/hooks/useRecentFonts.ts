'use client'

import { useState, useCallback } from 'react'

const STORAGE_KEY = 'recentFonts'
const MAX_RECENT = 10

export function useRecentFonts() {
  const [recentNames, setRecentNames] = useState<string[]>(() => {
    if (typeof window === 'undefined') return []
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
  })

  const addRecent = useCallback((family: string) => {
    setRecentNames(prev => {
      const next = [family, ...prev.filter(f => f !== family)].slice(0, MAX_RECENT)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  return { recentNames, addRecent }
}
