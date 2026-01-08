'use client'

import * as React from 'react'

import { Session, User } from '@supabase/supabase-js'
import { createClient } from '@/supabase/client'

/**
 * Listen to auth events
 *
 * @link https://supabase.com/docs/reference/javascript/auth-onauthstatechange
 */
interface AuthContextProps {
  session: Session | null
  user: User | null
  setSession: React.Dispatch<React.SetStateAction<Session | null>>
  setUser: React.Dispatch<React.SetStateAction<User | null>>
}

const AuthContext = React.createContext<AuthContextProps | undefined>({
  session: null,
  user: null,
  setSession: () => void 0,
  setUser: () => void 0,
})

const AuthProvider = ({ children }: { children?: React.ReactNode }) => {
  const [session, setSession] = React.useState<Session | null>(null)
  const [user, setUser] = React.useState<User | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const supabase = createClient()

    // Get initial session immediately
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    return () => subscription?.unsubscribe()
  }, [])

  const memoValue = React.useMemo(() => {
    return { session, user, setSession, setUser }
  }, [session, user])

  // Don't block rendering while checking auth
  return (
    <AuthContext.Provider value={memoValue}>{children}</AuthContext.Provider>
  )
}

export { AuthContext, type AuthContextProps, AuthProvider }
