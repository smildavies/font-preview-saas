'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase-browser'

export type FontEntry = {
  id: string
  name: string
  filename: string
  storage_path: string
  file_size: number
  format: string
  collection: string
  created_at: string
  fontUrl: string
  familyId: string
}

export function useFonts(userId: string | undefined) {
  const [fonts, setFonts] = useState<FontEntry[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const loadFonts = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    const { data } = await supabase
      .from('fonts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (data) {
      // Generate signed URLs for each font
      const fontsWithUrls = await Promise.all(
        data.map(async (font, i) => {
          const { data: urlData } = await supabase.storage
            .from('fonts')
            .createSignedUrl(font.storage_path, 3600)
          return {
            ...font,
            fontUrl: urlData?.signedUrl || '',
            familyId: `user-font-${i}`,
          }
        })
      )
      setFonts(fontsWithUrls)
    }
    setLoading(false)
  }, [userId])

  useEffect(() => {
    loadFonts()
  }, [loadFonts])

  const uploadFont = async (file: File): Promise<boolean> => {
    if (!userId) return false

    const ext = file.name.split('.').pop()?.toLowerCase() || ''
    const validExts = ['ttf', 'otf', 'woff', 'woff2']
    if (!validExts.includes(ext)) return false

    const storagePath = `${userId}/${Date.now()}-${file.name}`

    const { error: uploadError } = await supabase.storage
      .from('fonts')
      .upload(storagePath, file)

    if (uploadError) return false

    const name = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ')

    const { error: dbError } = await supabase.from('fonts').insert({
      user_id: userId,
      name,
      filename: file.name,
      storage_path: storagePath,
      file_size: file.size,
      format: ext,
    })

    if (dbError) return false

    await loadFonts()
    return true
  }

  const deleteFont = async (fontId: string, storagePath: string) => {
    await supabase.storage.from('fonts').remove([storagePath])
    await supabase.from('fonts').delete().eq('id', fontId)
    await loadFonts()
  }

  return { fonts, loading, uploadFont, deleteFont, refresh: loadFonts }
}
