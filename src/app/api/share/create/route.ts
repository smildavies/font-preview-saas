import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase-server'

export async function POST(request: Request) {
  try {
    // Auth check
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, fonts } = body as { name: string; fonts: string[] }

    if (!name?.trim() || !fonts?.length) {
      return NextResponse.json(
        { error: 'Name and at least one font are required' },
        { status: 400 }
      )
    }

    // Use service client to bypass RLS for insert
    const service = await createServiceClient()

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30)

    const { data, error } = await service
      .from('shared_collections')
      .insert({
        user_id: user.id,
        name: name.trim(),
        fonts,
        expires_at: expiresAt.toISOString(),
      })
      .select('id')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const url = `${appUrl}/share/${data.id}`

    return NextResponse.json({ id: data.id, url })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
