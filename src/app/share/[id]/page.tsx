import { createServiceClient } from '@/lib/supabase-server'
import ShareView from '@/components/ShareView'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function SharePage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createServiceClient()

  const { data: collection, error } = await supabase
    .from('shared_collections')
    .select('id, name, fonts, expires_at')
    .eq('id', id)
    .single()

  if (error || !collection) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-zinc-300 mb-2">Link Not Found</h1>
          <p className="text-sm text-zinc-500">This share link does not exist or has been removed.</p>
        </div>
      </div>
    )
  }

  // Check expiration
  const isExpired = new Date(collection.expires_at) < new Date()

  if (isExpired) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-zinc-300 mb-2">This Link Has Expired</h1>
          <p className="text-sm text-zinc-500">Share links are valid for 30 days. Ask the sender for a new link.</p>
        </div>
      </div>
    )
  }

  return (
    <ShareView
      collection={{
        id: collection.id,
        name: collection.name,
        fonts: collection.fonts as string[],
      }}
    />
  )
}
