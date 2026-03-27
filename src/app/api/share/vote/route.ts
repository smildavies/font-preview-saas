import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { collectionId, fontName, vote, voterName } = body as {
      collectionId: string
      fontName: string
      vote: 1 | -1
      voterName?: string
    }

    if (!collectionId || !fontName || (vote !== 1 && vote !== -1)) {
      return NextResponse.json(
        { error: 'collectionId, fontName, and vote (1 or -1) are required' },
        { status: 400 }
      )
    }

    // Use service client to bypass RLS (public endpoint)
    const service = await createServiceClient()

    const { error } = await service.from('votes').insert({
      collection_id: collectionId,
      font_name: fontName,
      vote,
      voter_name: voterName?.trim() || null,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
