'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import type { User } from '@supabase/supabase-js'

type Profile = {
  id: string
  email: string
  plan: 'free' | 'pro'
  font_count: number
  stripe_customer_id: string | null
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        setProfile(data)
      }
      setLoading(false)
    }
    load()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (!session?.user) setProfile(null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const OWNER_EMAIL = 'smildavies@yahoo.com'
  const isPro = profile?.plan === 'pro' || user?.email === OWNER_EMAIL
  const fontLimit = isPro ? Infinity : 10
  const canUpload = (profile?.font_count ?? 0) < fontLimit

  return { user, profile, loading, isPro, fontLimit, canUpload, supabase }
}
