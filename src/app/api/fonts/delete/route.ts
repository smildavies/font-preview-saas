import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { fontId, storagePath } = await req.json()

  if (!fontId || !storagePath) {
    return NextResponse.json({ error: 'Missing fontId or storagePath' }, { status: 400 })
  }

  // Verify ownership
  const { data: font } = await supabase
    .from('fonts')
    .select('id')
    .eq('id', fontId)
    .eq('user_id', user.id)
    .single()

  if (!font) {
    return NextResponse.json({ error: 'Font not found' }, { status: 404 })
  }

  // Delete from storage
  await supabase.storage.from('fonts').remove([storagePath])

  // Delete from database
  await supabase.from('fonts').delete().eq('id', fontId)

  return NextResponse.json({ ok: true })
}
