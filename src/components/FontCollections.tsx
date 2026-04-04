'use client'

import { useState, useEffect } from 'react'

interface FontCollectionsProps {
  onClose: () => void
  onSelectCollection: (fonts: string[]) => void
}

interface Collection {
  id: string
  name: string
  fonts: string[]
  createdAt: number
}

export default function FontCollections({ onClose, onSelectCollection }: FontCollectionsProps) {
  const [collections, setCollections] = useState<Collection[]>([])
  const [newName, setNewName] = useState('')

  // Escape key handler
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  useEffect(() => {
    try {
      const saved = localStorage.getItem('fontCollections')
      if (saved) setCollections(JSON.parse(saved))
    } catch {
      // Corrupted data — reset to empty
      localStorage.removeItem('fontCollections')
    }
  }, [])

  const save = (updated: Collection[]) => {
    setCollections(updated)
    localStorage.setItem('fontCollections', JSON.stringify(updated))
  }

  const createCollection = () => {
    if (!newName.trim()) return
    const newCol: Collection = {
      id: Date.now().toString(),
      name: newName.trim(),
      fonts: [],
      createdAt: Date.now(),
    }
    save([newCol, ...collections])
    setNewName('')
  }

  const deleteCollection = (id: string) => {
    save(collections.filter(c => c.id !== id))
  }

  const removeFont = (colId: string, fontName: string) => {
    save(collections.map(c => c.id === colId ? { ...c, fonts: c.fonts.filter(f => f !== fontName) } : c))
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <div>
            <h2 className="text-lg font-bold text-white">Font Collections</h2>
            <p className="text-xs text-zinc-500">Organize fonts into reusable collections</p>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white transition rounded-lg hover:bg-zinc-800">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Create new */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && createCollection()}
              placeholder="New collection name..."
              className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-violet-600 focus:outline-none"
            />
            <button onClick={createCollection} className="px-4 py-2 rounded-lg text-sm font-medium bg-violet-600 hover:bg-violet-500 text-white transition">
              Create
            </button>
          </div>

          {collections.length === 0 ? (
            <div className="text-center py-12 text-zinc-500">
              <p className="text-sm">No collections yet.</p>
              <p className="text-xs mt-1">Create a collection and add fonts by clicking the folder icon on any font card.</p>
            </div>
          ) : (
            collections.map(col => (
              <div key={col.id} className="border border-zinc-800 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-zinc-800/50">
                  <div>
                    <span className="text-sm font-medium text-white">{col.name}</span>
                    <span className="ml-2 text-xs text-zinc-500">{col.fonts.length} fonts</span>
                  </div>
                  <div className="flex gap-2">
                    {col.fonts.length > 0 && (
                      <button onClick={() => onSelectCollection(col.fonts)} className="text-xs text-violet-400 hover:text-violet-300 transition">
                        Filter to these
                      </button>
                    )}
                    <button onClick={() => deleteCollection(col.id)} className="text-xs text-red-400 hover:text-red-300 transition">
                      Delete
                    </button>
                  </div>
                </div>
                {col.fonts.length > 0 && (
                  <div className="px-4 py-3 flex flex-wrap gap-2">
                    {col.fonts.map(f => (
                      <span key={f} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800 border border-zinc-700 text-xs text-zinc-300">
                        <span style={{ fontFamily: `"${f}", sans-serif` }}>{f}</span>
                        <button onClick={() => removeFont(col.id, f)} className="text-zinc-500 hover:text-red-400 transition">x</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
