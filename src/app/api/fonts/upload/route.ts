import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

const VALID_EXTENSIONS = ['ttf', 'otf', 'woff', 'woff2']
const MAX_FILE_SIZE = 20 * 1024 * 1024 // 20MB

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check plan limits
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, font_count')
    .eq('id', user.id)
    .single()

  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

  const OWNER_EMAIL = 'smildavies@yahoo.com'
  const isOwner = user.email === OWNER_EMAIL
  const limit = (profile.plan === 'pro' || isOwner) ? Infinity : 10
  if (profile.font_count >= limit) {
    return NextResponse.json(
      { error: 'Font limit reached. Upgrade to Pro for unlimited uploads.' },
      { status: 403 }
    )
  }

  const formData = await req.formData()
  const file = formData.get('file') as File

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: 'File too large (max 20MB)' }, { status: 400 })
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || ''
  if (!VALID_EXTENSIONS.includes(ext)) {
    return NextResponse.json(
      { error: 'Invalid file type. Accepted: .ttf, .otf, .woff, .woff2' },
      { status: 400 }
    )
  }

  const storagePath = `${user.id}/${Date.now()}-${file.name}`

  const { error: uploadError } = await supabase.storage
    .from('fonts')
    .upload(storagePath, file)

  if (uploadError) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }

  const name = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ')

  const { data: font, error: dbError } = await supabase
    .from('fonts')
    .insert({
      user_id: user.id,
      name,
      filename: file.name,
      storage_path: storagePath,
      file_size: file.size,
      format: ext,
    })
    .select()
    .single()

  if (dbError) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }

  return NextResponse.json({ font })
}
