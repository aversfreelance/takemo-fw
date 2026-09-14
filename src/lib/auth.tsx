import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { api, type AuthUser } from './api'

const AuthContext = createContext<{
  user: AuthUser | null
  googleClientId: string
  ready: boolean
  setSession: (token: string, user: AuthUser) => void
  logout: () => Promise<void>
}>({
  user: null,
  googleClientId: '',
  ready: false,
  setSession: () => undefined,
  logout: async () => undefined,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [googleClientId, setGoogleClientId] = useState('')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    api
      .me()
      .then((data) => {
        setUser(data.user)
        setGoogleClientId(data.googleClientId)
      })
      .catch(() => setUser(null))
      .finally(() => setReady(true))
  }, [])

  function setSession(token: string, next: AuthUser) {
    localStorage.setItem('takemo-user', token)
    setUser(next)
  }

  async function logout() {
    await api.logout().catch(() => undefined)
    localStorage.removeItem('takemo-user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, googleClientId, ready, setSession, logout }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
