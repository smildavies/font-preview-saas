'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useUser } from '@/hooks/useUser'
import { type ReactNode } from 'react'

export default function DashboardShell({ children }: { children: ReactNode }) {
  const { user, profile, isPro, loading, supabase } = useUser()
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-950">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-zinc-700 border-t-violet-500" />
      </div>
    )
  }

  if (!user) {
    router.push('/login')
    return null
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md">
        <div className="mx-auto flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-lg font-bold text-white">
              My Font Preview
            </Link>
            <Link
              href="/dashboard/brand-kits"
              className="text-sm text-zinc-400 hover:text-violet-400 transition"
            >
              Brand Kits
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-400">{user.email}</span>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
              isPro
                ? 'bg-violet-600/20 text-violet-400 border border-violet-600/30'
                : 'bg-zinc-800 text-zinc-400'
            }`}>
              {isPro ? 'Pro' : 'Free'}
            </span>
            {!isPro && (
              <Link
                href="/api/stripe/checkout"
                className="rounded-lg bg-violet-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-violet-700 transition"
              >
                Upgrade
              </Link>
            )}
            <button
              onClick={handleSignOut}
              className="rounded-lg border border-zinc-700 px-4 py-1.5 text-sm text-zinc-400 hover:text-white hover:border-zinc-500 transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>
      {children}
    </div>
  )
}
