'use client'

import { useEffect } from 'react'

export default function CopyProtection() {
  useEffect(() => {
    // Disable right-click
    const onContext = (e: MouseEvent) => {
      e.preventDefault()
      return false
    }

    // Disable copy outside inputs
    const onCopy = (e: ClipboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag !== 'INPUT' && tag !== 'TEXTAREA') {
        e.preventDefault()
        return false
      }
    }

    // Disable drag
    const onDrag = (e: DragEvent) => { e.preventDefault() }

    // Disable keyboard shortcuts for source/devtools/save/print
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      // Ctrl+U (View Source)
      if (e.ctrlKey && e.key === 'u') { e.preventDefault(); return false }
      // Ctrl+S (Save)
      if (e.ctrlKey && e.key === 's') { e.preventDefault(); return false }
      // Ctrl+Shift+I/J/C (Dev Tools)
      if (e.ctrlKey && e.shiftKey && ['I','i','J','j','C','c'].includes(e.key)) { e.preventDefault(); return false }
      // F12
      if (e.key === 'F12') { e.preventDefault(); return false }
      // Ctrl+A outside inputs
      if (e.ctrlKey && e.key === 'a' && tag !== 'INPUT' && tag !== 'TEXTAREA') { e.preventDefault(); return false }
      // Ctrl+C outside inputs
      if (e.ctrlKey && e.key === 'c' && tag !== 'INPUT' && tag !== 'TEXTAREA') { e.preventDefault(); return false }
      // Ctrl+P (Print)
      if (e.ctrlKey && e.key === 'p') { e.preventDefault(); return false }
    }

    document.addEventListener('contextmenu', onContext)
    document.addEventListener('copy', onCopy)
    document.addEventListener('dragstart', onDrag)
    document.addEventListener('keydown', onKey)

    // Console warning
    console.log('%c⛔ STOP!', 'color: red; font-size: 60px; font-weight: bold;')
    console.log('%cThis application is protected by copyright law. Unauthorized copying, distribution, or modification is prohibited.', 'color: white; font-size: 16px;')
    console.log('%c© 2026 My Font Preview. All rights reserved.', 'color: gray; font-size: 12px;')

    return () => {
      document.removeEventListener('contextmenu', onContext)
      document.removeEventListener('copy', onCopy)
      document.removeEventListener('dragstart', onDrag)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  return null
}
