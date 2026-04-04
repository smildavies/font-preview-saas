'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useUser } from '@/hooks/useUser'
import { type ReactNode, useState, useEffect } from 'react'

export default function DashboardShell({ children }: { children: ReactNode }) {
  const { user, profile, isPro, loading, supabase } = useUser()
  const router = useRouter()
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess(false)

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match')
      return
    }

    setPasswordLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error
      setPasswordSuccess(true)
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => {
        setShowPasswordModal(false)
        setPasswordSuccess(false)
      }, 2000)
    } catch (err: unknown) {
      setPasswordError(err instanceof Error ? err.message : 'Failed to update password')
    } finally {
      setPasswordLoading(false)
    }
  }

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [loading, user, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-950">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-zinc-700 border-t-violet-500" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md">
        <div className="mx-auto flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3">
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="/dashboard" className="text-lg font-bold text-white whitespace-nowrap">
              My Font Preview
            </Link>
            <Link
              href="/dashboard/brand-kits"
              className="text-sm text-zinc-400 hover:text-violet-400 transition"
            >
              Brand Kits
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <span className="hidden sm:inline text-sm text-zinc-400 truncate max-w-[200px]">{user.email}</span>
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
                className="rounded-lg bg-violet-600 px-3 sm:px-4 py-1.5 text-sm font-medium text-white hover:bg-violet-700 transition"
              >
                Upgrade
              </Link>
            )}
            <button
              onClick={() => setShowPasswordModal(true)}
              className="rounded-lg border border-zinc-700 px-3 sm:px-4 py-1.5 text-sm text-zinc-400 hover:text-white hover:border-zinc-500 transition"
            >
              Settings
            </button>
            <button
              onClick={handleSignOut}
              className="rounded-lg border border-zinc-700 px-3 sm:px-4 py-1.5 text-sm text-zinc-400 hover:text-white hover:border-zinc-500 transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>
      {children}

      {showPasswordModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">Account Settings</h2>
              <button
                onClick={() => { setShowPasswordModal(false); setPasswordError(''); setPasswordSuccess(false); setNewPassword(''); setConfirmPassword('') }}
                className="text-zinc-500 hover:text-white transition p-1"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-6 p-3 rounded-lg bg-zinc-800/50 border border-zinc-700">
              <p className="text-xs text-zinc-500 mb-1">Email</p>
              <p className="text-sm text-white">{user?.email}</p>
              <p className="text-xs text-zinc-500 mt-2 mb-1">Plan</p>
              <p className="text-sm text-white">{isPro ? 'Pro' : 'Free'}</p>
            </div>

            <h3 className="text-sm font-semibold text-zinc-300 mb-3">Change Password</h3>
            <form onSubmit={handleChangePassword} className="space-y-3">
              <input
                type="password"
                placeholder="New password"
                minLength={6}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition"
              />
              <input
                type="password"
                placeholder="Confirm new password"
                minLength={6}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition"
              />

              {passwordError && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-2 text-sm text-red-400">
                  {passwordError}
                </div>
              )}
              {passwordSuccess && (
                <div className="rounded-lg bg-green-500/10 border border-green-500/20 px-4 py-2 text-sm text-green-400">
                  Password updated successfully!
                </div>
              )}

              <button
                type="submit"
                disabled={passwordLoading}
                className="w-full rounded-lg bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-medium py-2.5 text-sm transition"
              >
                {passwordLoading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
