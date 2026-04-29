import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { api, setupRefreshInterceptor, type User } from '../services/api'

const GITHUB_LOGIN_URL = `${import.meta.env.VITE_API_URL ?? '/api'}/auth/github`

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: () => void
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const logout = useCallback(async () => {
    try {
      await api.logout()
    } catch {
      // best effort — clear local state regardless
    }
    setUser(null)
  }, [])

  // Register the refresh interceptor once, passing logout as the unauthenticated handler
  useEffect(() => {
    setupRefreshInterceptor(logout)
  }, [logout])

  // Rehydrate session by calling /user/me (validates the HTTP-only cookie)
  useEffect(() => {
    api
      .getMe()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false))
  }, [])

  // Kick off the GitHub OAuth flow — the backend handles everything
  // and redirects back to the frontend with cookies already set.
  const login = () => {
    window.location.href = GITHUB_LOGIN_URL
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

