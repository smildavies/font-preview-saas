'use client'

import { useState, useEffect, useCallback } from 'react'
import { useUser } from '@/hooks/useUser'
import { useLocalFonts } from '@/hooks/useLocalFonts'
import BrandKitBuilder from '@/components/BrandKitBuilder'

interface BrandKit {
  id: string
  user_id: string
  name: string
  heading_font: string
  body_font: string
  colors: string[]
}

export default function BrandKitsPage() {
  const { user, supabase, loading: userLoading } = useUser()
  const { fonts } = useLocalFonts()
  const allFontNames = fonts.map(f => f.family)

  const [kits, setKits] = useState<BrandKit[]>([])
  const [loading, setLoading] = useState(true)
  const [showBuilder, setShowBuilder] = useState(false)
  const [editingKit, setEditingKit] = useState<BrandKit | undefined>(undefined)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchKits = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data } = await supabase
      .from('brand_kits')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setKits(data ?? [])
    setLoading(false)
  }, [user, supabase])

  useEffect(() => {
    if (user) fetchKits()
  }, [user, fetchKits])

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    await supabase.from('brand_kits').delete().eq('id', id)
    setKits(prev => prev.filter(k => k.id !== id))
    setDeletingId(null)
  }

  const handleEdit = (kit: BrandKit) => {
    setEditingKit(kit)
    setShowBuilder(true)
  }

  const handleClose = () => {
    setShowBuilder(false)
    setEditingKit(undefined)
    fetchKits()
  }

  if (userLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-zinc-700 border-t-violet-500" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Brand Kits</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Save font and color combinations for your projects
          </p>
        </div>
        <button
          onClick={() => {
            setEditingKit(undefined)
            setShowBuilder(true)
          }}
          className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-violet-700 transition flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Create New Kit
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-zinc-700 border-t-violet-500" />
        </div>
      ) : kits.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-zinc-800">
          <div className="w-16 h-16 rounded-full bg-violet-600/10 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-zinc-300 mb-1">No brand kits yet</h3>
          <p className="text-sm text-zinc-500 mb-6">Create your first brand kit to save font and color combinations</p>
          <button
            onClick={() => setShowBuilder(true)}
            className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-violet-700 transition"
          >
            Create Your First Kit
          </button>
        </div>
      ) : (
        /* Kit Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {kits.map(kit => (
            <div
              key={kit.id}
              className="group rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden hover:border-violet-600/50 transition-all cursor-pointer"
              onClick={() => handleEdit(kit)}
            >
              {/* Color bar */}
              <div className="flex h-2">
                {(kit.colors ?? []).map((c, i) => (
                  <div key={i} className="flex-1" style={{ backgroundColor: c }} />
                ))}
              </div>

              <div className="p-5">
                {/* Kit name + actions */}
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-base font-semibold text-zinc-100 group-hover:text-violet-400 transition">
                    {kit.name}
                  </h3>
                  <button
                    onClick={e => {
                      e.stopPropagation()
                      handleDelete(kit.id)
                    }}
                    disabled={deletingId === kit.id}
                    className="rounded-lg p-1.5 text-zinc-600 hover:text-red-400 hover:bg-red-400/10 transition opacity-0 group-hover:opacity-100"
                    title="Delete kit"
                  >
                    {deletingId === kit.id ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-600 border-t-red-400" />
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Font previews */}
                <div className="space-y-2 mb-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-zinc-600">Heading</span>
                    <p
                      className="text-lg text-zinc-200 truncate"
                      style={{ fontFamily: `"${kit.heading_font}", sans-serif` }}
                    >
                      {kit.heading_font}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-zinc-600">Body</span>
                    <p
                      className="text-sm text-zinc-400 truncate"
                      style={{ fontFamily: `"${kit.body_font}", sans-serif` }}
                    >
                      The quick brown fox jumps over the lazy dog
                    </p>
                  </div>
                </div>

                {/* Color swatches */}
                <div className="flex gap-2">
                  {(kit.colors ?? []).map((c, i) => (
                    <div
                      key={i}
                      className="w-7 h-7 rounded-lg border border-zinc-700"
                      style={{ backgroundColor: c }}
                      title={c}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Brand Kit Builder Modal */}
      {user && (
        <BrandKitBuilder
          isOpen={showBuilder}
          onClose={handleClose}
          userId={user.id}
          allFonts={allFontNames}
          existingKit={editingKit}
        />
      )}
    </div>
  )
}
