'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-browser'

type Tab = 'signin' | 'signup'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [tab, setTab] = useState<Tab>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const [signupSuccess, setSignupSuccess] = useState(false)

  async function handleReset() {
    if (!email) {
      setError('Enter your email address first')
      return
    }
    setError(null)
    setLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/dashboard`,
      })
      if (error) throw error
      setResetSent(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (tab === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error
        // If email confirmation is required, user won't have a session yet
        if (!data.session) {
          setResetSent(false)
          setError(null)
          setSignupSuccess(true)
          setLoading(false)
          return
        }
      }
      router.push('/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-4">
      <Link
        href="/"
        className="text-xl font-bold text-white mb-8"
      >
        Font<span className="text-violet-500">Preview</span>
      </Link>

      <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900/60 p-8">
        {/* Tabs */}
        <div className="flex mb-8 border-b border-zinc-800">
          <button
            onClick={() => { setTab('signin'); setError(null) }}
            className={`flex-1 pb-3 text-sm font-medium transition-colors ${
              tab === 'signin'
                ? 'text-violet-400 border-b-2 border-violet-500'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setTab('signup'); setError(null) }}
            className={`flex-1 pb-3 text-sm font-medium transition-colors ${
              tab === 'signup'
                ? 'text-violet-400 border-b-2 border-violet-500'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-colors"
            />
          </div>

          {tab === 'signin' && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
              >
                Forgot Password?
              </button>
            </div>
          )}

          {resetSent && (
            <div className="rounded-lg bg-green-500/10 border border-green-500/20 px-4 py-3 text-sm text-green-400">
              Password reset email sent! Check your inbox.
            </div>
          )}

          {signupSuccess && (
            <div className="rounded-lg bg-green-500/10 border border-green-500/20 px-4 py-3 text-sm text-green-400">
              Account created! Check your email for a confirmation link, then come back and sign in.
            </div>
          )}

          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 text-sm transition-colors"
          >
            {loading
              ? 'Loading...'
              : tab === 'signin'
              ? 'Sign In'
              : 'Create Account'}
          </button>
        </form>
      </div>

      <Link
        href="/"
        className="mt-6 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
      >
        &larr; Back to home
      </Link>
    </div>
  )
}
